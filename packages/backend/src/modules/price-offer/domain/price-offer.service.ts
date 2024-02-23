import {
  AggregateName,
  EventName,
  PriceOffer,
  PriceOfferStatus,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Injectable, Logger } from '@nestjs/common';
import { Amount, UUID, ValueDate } from '@libs/domain/value-objects';
import { IChatService } from '@modules/chat/domain/ports/chat-service';
import {
  IncoherentPriceOfferStatus,
  OngoingPriceOfferExisting,
  PriceOfferNotFound,
  ForbiddenParticipation,
  PriceOfferIsNotAcceptable,
} from './exceptions';
import { IStoreClient } from './ports/store.client';
import dayjs from 'dayjs';
import { capitalize, first } from 'lodash';
import { IPriceOfferService } from './ports/price-offer';
import { IOrder } from 'shopify-api-node';
import { Locales, getDictionnary } from '@libs/i18n';
import { IEmailClient } from './ports/email.client';
import { ParticipantEmailSender, Participants } from './config';

const dict = getDictionnary(Locales.FR);

@Injectable()
export class PriceOfferService implements IPriceOfferService {
  private readonly logger = new Logger(PriceOfferService.name);

  constructor(
    protected readonly prisma: PrismaMainClient,
    protected readonly chatService: IChatService,
    protected readonly storeClient: IStoreClient,
    protected readonly emailClient: IEmailClient,
  ) {}

  async createNewPriceOffer(
    userId: UUID,
    buyerId: UUID,
    newPrice: Amount,
    productId: UUID,
    productVariantId?: UUID,
  ): Promise<PriceOffer> {
    if (await this.isPriceOfferOngoing(buyerId, productId)) {
      throw new OngoingPriceOfferExisting(buyerId, productId);
    }

    if (!(await this.isPriceOfferAcceptable(newPrice, productId))) {
      throw new PriceOfferIsNotAcceptable(newPrice, productId);
    }

    const { sellerName } = await this.prisma.customer.findUniqueOrThrow({
      where: { authUserId: userId.uuid },
      select: { sellerName: true, user: { select: { email: true } } },
    });

    const newPriceOffer = await this.prisma.priceOffer.create({
      data: {
        buyerId: buyerId.uuid,
        productId: productId.uuid,
        productVariantId: productVariantId?.uuid,
        newPriceInCents: newPrice.amountInCents,
        initiatedBy: userId.uuid,
        status: PriceOfferStatus.PROPOSED,
      },
    });

    const priceOfferUUID = new UUID({ uuid: newPriceOffer.id });

    await this.prisma.event.create({
      data: {
        aggregateName: AggregateName.CUSTOMER,
        aggregateId: buyerId.uuid,
        name: EventName.PRICE_OFFER_CREATED,
        payload: {
          priceOfferId: newPriceOffer.id,
        },
      },
    });

    await this.sendMessageToConversation(
      priceOfferUUID,
      userId,
      dict.priceOffer.newPriceOffer(sellerName, newPrice),
    );

    const product = await this.prisma.product.findFirstOrThrow({
      where: { id: productId.uuid },
      select: { handle: true },
    });

    await this.sendEmailToPriceOfferParticipants(
      priceOfferUUID,
      this.emailClient.buildNewEmailSender(
        capitalize(product.handle?.replaceAll('-', ' ')),
        newPrice,
      ),
    );

    return newPriceOffer;
  }

  async updatePriceOfferStatus(
    userId: UUID,
    priceOfferId: UUID,
    newStatus: PriceOfferStatus,
  ): Promise<PriceOffer> {
    await this.checkUpdatePriceOffer(userId, priceOfferId, newStatus);

    return await this.changePriceOfferStatus(priceOfferId, newStatus);
  }

  async cancelPriceOffer(userId: UUID, priceOfferId: UUID): Promise<void> {
    const updatedPriceOffer = await this.updatePriceOfferStatus(
      userId,
      priceOfferId,
      PriceOfferStatus.CANCELED,
    );

    const priceOfferAmount = new Amount({
      amountInCents: Number(updatedPriceOffer.newPriceInCents),
    });

    await this.sendMessageToConversation(
      priceOfferId,
      userId,
      dict.priceOffer.canceledPriceOffer(priceOfferAmount),
    );
  }

  async declinePriceOffer(userId: UUID, priceOfferId: UUID): Promise<void> {
    const updatedPriceOffer = await this.updatePriceOfferStatus(
      userId,
      priceOfferId,
      PriceOfferStatus.DECLINED,
    );

    const priceOfferAmount = new Amount({
      amountInCents: Number(updatedPriceOffer.newPriceInCents),
    });

    await this.sendMessageToConversation(
      priceOfferId,
      userId,
      dict.priceOffer.declinedPriceOffer(priceOfferAmount),
    );

    await this.sendEmailToPriceOfferParticipants(
      priceOfferId,
      this.emailClient.buildDeclinedEmailSender(),
    );
  }

  async acceptPriceOffer(userId: UUID, priceOfferId: UUID): Promise<void> {
    await this.checkUpdatePriceOffer(
      userId,
      priceOfferId,
      PriceOfferStatus.ACCEPTED,
    );

    const { discountCode } = await this.createDiscountCode(priceOfferId);

    const updatedPriceOffer = await this.changePriceOfferStatus(
      priceOfferId,
      PriceOfferStatus.ACCEPTED,
      discountCode,
    );

    const priceOfferAmount = new Amount({
      amountInCents: Number(updatedPriceOffer.newPriceInCents),
    });

    const initialPrice = await this.getInitialPrice(
      new UUID({ uuid: updatedPriceOffer.productId }),
      updatedPriceOffer.productVariantId
        ? new UUID({ uuid: updatedPriceOffer.productVariantId })
        : undefined,
    );

    await this.sendMessageToConversation(
      priceOfferId,
      userId,
      dict.priceOffer.acceptedPriceOffer(priceOfferAmount, initialPrice),
    );
    await this.sendMessageToConversation(
      priceOfferId,
      userId,
      dict.priceOffer.discountCode(discountCode),
    );

    const product = await this.prisma.product.findFirstOrThrow({
      where: { id: updatedPriceOffer.productId },
      select: { handle: true },
    });

    await this.sendEmailToPriceOfferParticipants(
      priceOfferId,
      this.emailClient.buildAcceptedEmailSender(
        priceOfferAmount,
        product.handle ?? '',
        discountCode,
      ),
    );
  }

  async updatePriceOfferStatusFromOrder(order: IOrder): Promise<void> {
    const usedDiscountCodes = order.discount_applications.map(
      (discount) => discount.code,
    );
    if (!usedDiscountCodes || usedDiscountCodes.length === 0) return;

    const relatedPriceOffers = await this.prisma.priceOffer.findMany({
      where: { discountCode: { in: usedDiscountCodes } },
    });

    await Promise.all(
      relatedPriceOffers.map((priceOffer) =>
        this.changePriceOfferStatus(
          new UUID({ uuid: priceOffer.id }),
          PriceOfferStatus.BOUGHT_WITH,
        ),
      ),
    );

    return;
  }

  private async changePriceOfferStatus(
    priceOfferId: UUID,
    newStatus: PriceOfferStatus,
    discountCode?: string,
  ): Promise<PriceOffer> {
    const data: { status: PriceOfferStatus; discountCode?: string } = {
      status: newStatus,
    };

    if (discountCode) data.discountCode = discountCode;

    const updatedPriceOffer = await this.prisma.priceOffer.update({
      where: {
        id: priceOfferId.uuid,
      },
      data,
    });

    await this.prisma.event.create({
      data: {
        aggregateName: AggregateName.CUSTOMER,
        aggregateId: updatedPriceOffer.buyerId,
        name: EventName.PRICE_OFFER_STATUS_UPDATED,
        payload: {
          priceOfferId: priceOfferId.uuid,
          newStatus,
        },
      },
    });

    return updatedPriceOffer;
  }

  private async createDiscountCode(
    priceOfferId: UUID,
  ): Promise<{ discountCode: string }> {
    const priceOffer = await this.prisma.priceOffer.findUniqueOrThrow({
      where: { id: priceOfferId.uuid },
      select: {
        buyerId: true,
        newPriceInCents: true,
        productId: true,
        productVariantId: true,
      },
    });

    const productPrice = await this.getInitialPrice(
      new UUID({ uuid: priceOffer.productId }),
      priceOffer.productVariantId
        ? new UUID({ uuid: priceOffer.productVariantId })
        : undefined,
    );

    return await this.storeClient.createDiscountCode(
      new UUID({ uuid: priceOffer.buyerId }),
      new ValueDate({ date: dayjs().add(3, 'day').toDate() }),
      new Amount({
        amountInCents:
          productPrice.amountInCents - Number(priceOffer.newPriceInCents),
      }),
      new UUID({ uuid: priceOffer.productId }),
      priceOffer.productVariantId
        ? new UUID({ uuid: priceOffer.productVariantId })
        : undefined,
    );
  }

  private async isPriceOfferAcceptable(
    newPrice: Amount,
    productId: UUID,
    productVariantId?: UUID,
  ) {
    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId.uuid },
      select: {
        vendor: {
          select: {
            NegociationAgreement: { select: { maxAmountPercent: true } },
          },
        },
      },
    });

    const initialPrice = await this.getInitialPrice(
      productId,
      productVariantId,
    );

    const negociationAgreement = first(product.vendor.NegociationAgreement);

    if (!negociationAgreement) {
      return false;
    }

    return (
      newPrice.amountInCents >=
      initialPrice.amountInCents *
        (1 - negociationAgreement.maxAmountPercent / 100)
    );
  }

  private async getInitialPrice(productId: UUID, productVariantId?: UUID) {
    if (productVariantId) {
      const productVariant = await this.prisma.productVariant.findUniqueOrThrow(
        {
          where: { id: productVariantId.uuid },
        },
      );

      return new Amount({ amountInCents: Number(productVariant.priceInCents) });
    }

    const product = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId.uuid },
      select: {
        variants: {
          select: { priceInCents: true },
          take: 1,
          where: { quantity: { gt: 0 } },
        },
      },
    });

    return new Amount({
      amountInCents: Number(first(product.variants)?.priceInCents),
    });
  }

  private async isPriceOfferOngoing(buyerId: UUID, productId: UUID) {
    const ongoingOffer = await this.prisma.priceOffer.findFirst({
      where: {
        buyerId: buyerId.uuid,
        productId: productId.uuid,
        status: PriceOfferStatus.PROPOSED,
      },
    });

    return !!ongoingOffer;
  }

  private async checkUpdatePriceOffer(
    userId: UUID,
    priceOfferId: UUID,
    targetStatus: PriceOfferStatus,
  ): Promise<void> {
    const priceOffer = await this.prisma.priceOffer.findFirstOrThrow({
      where: {
        id: priceOfferId.uuid,
      },
    });

    if (priceOffer.status !== PriceOfferStatus.PROPOSED) {
      throw new IncoherentPriceOfferStatus(priceOfferId, priceOffer.status);
    }

    if (
      !this.isParticipant(userId, priceOfferId) ||
      (userId.equals(new UUID({ uuid: priceOffer.initiatedBy })) &&
        targetStatus === PriceOfferStatus.ACCEPTED)
    ) {
      throw new ForbiddenParticipation(priceOfferId, userId);
    }
  }

  private async isParticipant(
    userId: UUID,
    priceOfferId: UUID,
  ): Promise<boolean> {
    const priceOffer = await this.prisma.priceOffer.findFirstOrThrow({
      where: {
        id: priceOfferId.uuid,
      },
      select: {
        buyerId: true,
        ProductVariant: { select: { product: { select: { vendorId: true } } } },
      },
    });

    return [
      priceOffer.buyerId,
      priceOffer.ProductVariant?.product.vendorId,
    ].includes(userId.uuid);
  }

  private async sendMessageToConversation(
    priceOfferId: UUID,
    userId: UUID,
    message: string,
  ): Promise<void> {
    const conversationId = await this.getAssociatedConversationId(priceOfferId);
    const sender = await this.prisma.customer.findUniqueOrThrow({
      where: { authUserId: userId.uuid },
    });

    await this.chatService.writeMessage(
      sender.shopifyId.toString(),
      message,
      conversationId,
    );
  }

  private async getAssociatedConversationId(priceOfferId: UUID) {
    const { Product: priceOfferProduct, buyerId } =
      await this.prisma.priceOffer.findUniqueOrThrow({
        where: {
          id: priceOfferId.uuid,
        },
        select: {
          buyerId: true,
          Product: { select: { shopifyId: true } },
        },
      });

    if (!priceOfferProduct) {
      throw new PriceOfferNotFound(priceOfferId);
    }

    const { conversationId } =
      await this.chatService.getOrCreateConversationFromAuthUserId(
        new UUID({ uuid: buyerId }),
        priceOfferProduct.shopifyId.toString(),
      );

    return conversationId;
  }

  private async sendEmailToPriceOfferParticipants(
    priceOfferId: UUID,
    sendEmailToParticipants: ParticipantEmailSender,
  ) {
    const priceOffer = await this.prisma.priceOffer.findUniqueOrThrow({
      where: { id: priceOfferId.uuid },
    });

    const buyer = await this.prisma.customer.findFirstOrThrow({
      where: { authUserId: priceOffer.buyerId },
      select: {
        authUserId: true,
        sellerName: true,
        user: { select: { email: true } },
      },
    });

    const seller = await this.prisma.product.findFirstOrThrow({
      where: { id: priceOffer.productId },
      select: {
        vendor: {
          select: {
            sellerName: true,
            user: { select: { email: true } },
          },
        },
      },
    });

    const buyerParticipant = {
      email: buyer.user.email!,
      name: buyer.sellerName ?? '',
    };
    const sellerParticipant = {
      email: seller.vendor.user.email!,
      name: seller.vendor.sellerName ?? '',
    };

    const conversationId = await this.getAssociatedConversationId(priceOfferId);

    return await sendEmailToParticipants(
      {
        [Participants.BUYER]: buyerParticipant,
        [Participants.SELLER]: sellerParticipant,
        [Participants.INITIATOR]:
          buyer.authUserId === priceOffer.initiatedBy
            ? buyerParticipant
            : sellerParticipant,
        [Participants.RECEIVER]:
          buyer.authUserId === priceOffer.initiatedBy
            ? sellerParticipant
            : buyerParticipant,
      },
      conversationId,
    );
  }
}
