import envConfig from '@config/env/env.config';
import {
  AggregateName,
  PriceOffer,
  PriceOfferStatus,
  PrismaMainClient,
  SalesChannelName,
} from '@libs/domain/prisma.main.client';
import { PrismaStoreClient } from '@libs/domain/prisma.store.client';
import { Author } from '@libs/domain/types';
import { Amount, Stock, UUID, ValueDate } from '@libs/domain/value-objects';
import { Locales, getDictionnary } from '@libs/i18n';
import { IChatService } from '@modules/chat/domain/ports/chat-service';
import { ICommissionRepository } from '@modules/product/domain/ports/commission.repository';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import dayjs from 'dayjs';
import { first } from 'lodash';
import { ParticipantEmailSender, Participants } from './config';
import { PriceOfferCreatedDomainEvent } from './events/price-offer.created.domain-event';
import { PriceOfferUpdatedDomainEvent } from './events/price-offer.updated.domain-event';
import {
  ForbiddenParticipation,
  IncoherentPriceOfferStatus,
  PriceOfferIsNotAcceptable,
  PriceOfferNotFound,
} from './exceptions';
import { IEmailClient } from './ports/email.client';
import { IInternalNotificationClient } from './ports/internal-notification.client';
import { IInternalTrackingClient } from './ports/internal-tracking.client';
import { IPriceOfferService, PriceOfferUpdates } from './ports/price-offer';
import { IStoreClient } from './ports/store.client';

const dict = getDictionnary(Locales.FR);

@Injectable()
export class PriceOfferService implements IPriceOfferService {
  constructor(
    protected readonly prisma: PrismaMainClient,
    protected readonly storePrisma: PrismaStoreClient,
    protected readonly chatService: IChatService,
    protected readonly storeClient: IStoreClient,
    protected readonly emailClient: IEmailClient,
    protected readonly internalNotificationClient: IInternalNotificationClient,
    protected readonly internalTrackingClient: IInternalTrackingClient,
    protected readonly commissionRepository: ICommissionRepository,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async createNewPublicPriceOffer(
    userId: UUID,
    buyerId: UUID,
    newPrice: Amount,
    productId: UUID,
    productVariantId?: UUID,
  ): Promise<PriceOffer> {
    const quantity = 1;

    const ongoingOffer = await this.getOngoingPriceOffer(buyerId, productId);
    if (ongoingOffer) {
      await this.cancelPriceOffer(userId, new UUID({ uuid: ongoingOffer.id }));
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
        salesChannelName: SalesChannelName.PUBLIC,
        quantity,
        buyerId: buyerId.uuid,
        productId: productId.uuid,
        productVariantId: productVariantId?.uuid,
        newPriceInCents: newPrice.amountInCents,
        initiatedBy: userId.uuid,
        status: PriceOfferStatus.PROPOSED,
      },
    });

    const priceOfferUUID = new UUID({ uuid: newPriceOffer.id });

    this.eventEmitter.emit(
      PriceOfferCreatedDomainEvent.EVENT_NAME,
      new PriceOfferCreatedDomainEvent({
        aggregateId: newPriceOffer.id,
        aggregateName: AggregateName.PRICE_OFFER,
        payload: {
          initiatedBy: userId.uuid,
          newPriceInCents: newPrice.amount.toFixed(4),
          quantity: quantity.toString(),
        },
        metadata: {
          author: { id: userId.uuid, type: 'user' },
          newPriceInCents: parseInt(newPriceOffer.newPriceInCents.toString()),
          quantity: newPriceOffer.quantity,
          includedBuyerCommissionPercentage:
            newPriceOffer.includedBuyerCommissionPercentage,
          status: newPriceOffer.status,
        },
      }),
    );

    await this.sendMessageToConversation(
      priceOfferUUID,
      userId,
      dict.priceOffer.newPriceOffer(sellerName, newPrice),
    );

    const { title } =
      await this.storePrisma.storeExposedProduct.findFirstOrThrow({
        where: { id: productId.uuid },
        select: { title: true },
      });

    await this.sendEmailToPriceOfferParticipants(
      priceOfferUUID,
      this.emailClient.buildNewEmailSender(title, newPrice),
    );

    return newPriceOffer;
  }

  async createNewB2BPriceOfferByBuyer(
    buyerId: UUID,
    buyerPrice: Amount,
    sellerPrice: Amount,
    productId: UUID,
    description: string,
    quantity: Stock,
  ): Promise<void> {
    const participantDataQuery = {
      select: {
        sellerName: true,
        user: { select: { email: true, phone_number: true } },
      },
    };

    const {
      sellerName: buyerName,
      user: { phone_number: buyerPhone, email: buyerEmail },
    } = await this.prisma.customer.findUniqueOrThrow({
      where: { authUserId: buyerId.uuid },
      ...participantDataQuery,
    });

    const {
      productType,
      handle,
      vendor: {
        sellerName: sellerName,
        user: { phone_number: sellerPhone, email: sellerEmail },
      },
    } = await this.prisma.product.findUniqueOrThrow({
      where: { id: productId.uuid },
      select: {
        productType: true,
        handle: true,
        vendor: participantDataQuery,
      },
    });

    const commission =
      await this.commissionRepository.getGlobalB2BBuyerCommission();

    const newPriceOffer = await this.prisma.priceOffer.create({
      data: {
        salesChannelName: SalesChannelName.B2B,
        quantity: quantity.stock,
        buyerId: buyerId.uuid,
        productId: productId.uuid,
        newPriceInCents: buyerPrice.amountInCents,
        initiatedBy: buyerId.uuid,
        status: PriceOfferStatus.PROPOSED,
        includedBuyerCommissionPercentage: commission.percentage,
        internalNote: description,
      },
    });

    this.eventEmitter.emit(
      PriceOfferCreatedDomainEvent.EVENT_NAME,
      new PriceOfferCreatedDomainEvent({
        aggregateId: newPriceOffer.id,
        aggregateName: AggregateName.PRICE_OFFER,
        payload: {
          initiatedBy: buyerId.uuid,
          newPriceInCents: buyerPrice.amount.toFixed(4),
          quantity: quantity.stock.toString(),
        },
        metadata: {
          author: { id: buyerId.uuid, type: 'user' },
          newPriceInCents: parseInt(newPriceOffer.newPriceInCents.toString()),
          quantity: newPriceOffer.quantity,
          includedBuyerCommissionPercentage:
            newPriceOffer.includedBuyerCommissionPercentage,
          status: newPriceOffer.status,
        },
      }),
    );

    const offerMessage = `
      🚲 Produit: ${productType} - ${handle}
      #️⃣ Quantité: ${quantity.stock}
      💶 Prix acheteur: ${buyerPrice.formattedAmount}
      💶 Prix vendeur: ${sellerPrice.formattedAmount}
      📄 Détail de l'offre: ${description}

      📧 Contact acheteur:  ${buyerName} - ${buyerEmail} - ${buyerPhone}
      📧 Contact vendeur: ${sellerName} - ${sellerEmail} - ${sellerPhone}

      (Note: Prix incluant la commission de ${commission.percentage}%)
    `;

    await this.internalNotificationClient.sendB2BNotification(`
      💰 *${buyerName}* a déposé une nouvelle offre B2B pour le produit ${envConfig.frontendBaseUrl}/pro?product=${productId.uuid}

     ${offerMessage}
    `);

    await this.internalTrackingClient.createB2BOffer(offerMessage);
  }

  async updatePriceOfferStatus(
    userId: UUID,
    priceOfferId: UUID,
    newStatus: PriceOfferStatus,
  ): Promise<PriceOffer> {
    await this.checkUpdatePriceOffer(userId, priceOfferId, newStatus);

    return await this.changePriceOfferStatus(
      { type: 'user', id: userId.uuid },
      priceOfferId,
      newStatus,
    );
  }

  async updatePriceOfferByAdmin(
    priceOfferId: UUID,
    updates: PriceOfferUpdates,
    authorId?: string,
  ) {
    const updatedPriceOffer = await this.prisma.priceOffer.update({
      where: {
        id: priceOfferId.uuid,
      },
      data: updates,
      select: {
        quantity: true,
        newPriceInCents: true,
        includedBuyerCommissionPercentage: true,
        status: true,
      },
    });

    this.eventEmitter.emit(
      PriceOfferUpdatedDomainEvent.EVENT_NAME,
      new PriceOfferUpdatedDomainEvent({
        updates,
        aggregateId: priceOfferId.uuid,
        aggregateName: AggregateName.PRICE_OFFER,
        metadata: {
          author: {
            id: authorId,
            type: 'admin',
          },
          ...updatedPriceOffer,
          newPriceInCents: parseInt(
            updatedPriceOffer.newPriceInCents.toString(),
          ),
        },
      }),
    );
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
    const { title } =
      await this.storePrisma.storeExposedProduct.findFirstOrThrow({
        where: { id: updatedPriceOffer.productId },
        select: { title: true },
      });

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
      this.emailClient.buildDeclinedEmailSender(title),
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
      { type: 'user', id: userId.uuid },
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

    const { title } =
      await this.storePrisma.storeExposedProduct.findFirstOrThrow({
        where: { id: updatedPriceOffer.productId },
        select: { title: true },
      });

    await this.sendEmailToPriceOfferParticipants(
      priceOfferId,
      this.emailClient.buildAcceptedEmailSender(
        priceOfferAmount,
        title,
        discountCode,
      ),
    );
  }

  async updatePriceOfferStatusFromOrder(
    priceOffers: Pick<PriceOffer, 'id'>[],
    orderId: string,
    author: Author,
  ): Promise<void> {
    await Promise.all(
      priceOffers.map(({ id }) =>
        this.changePriceOfferStatus(
          author,
          new UUID({ uuid: id }),
          PriceOfferStatus.BOUGHT_WITH,
          undefined,
          orderId,
        ),
      ),
    );

    return;
  }

  private async changePriceOfferStatus(
    author: Author,
    priceOfferId: UUID,
    status: PriceOfferStatus,
    discountCode?: string,
    orderId?: string,
  ): Promise<PriceOffer> {
    const updates = {
      status,
      discountCode,
      orderId,
    };

    const updatedPriceOffer = await this.prisma.priceOffer.update({
      where: {
        id: priceOfferId.uuid,
      },
      data: updates,
    });

    this.eventEmitter.emit(
      PriceOfferUpdatedDomainEvent.EVENT_NAME,
      new PriceOfferUpdatedDomainEvent({
        updates,
        aggregateId: priceOfferId.uuid,
        aggregateName: AggregateName.PRICE_OFFER,
        metadata: {
          author,
          newPriceInCents: parseInt(
            updatedPriceOffer.newPriceInCents.toString(),
          ),
          quantity: updatedPriceOffer.quantity,
          includedBuyerCommissionPercentage:
            updatedPriceOffer.includedBuyerCommissionPercentage,
          status: updatedPriceOffer.status,
        },
      }),
    );

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
            negociationAgreements: { select: { maxAmountPercent: true } },
          },
        },
      },
    });

    const initialPrice = await this.getInitialPrice(
      productId,
      productVariantId,
    );

    const negociationAgreement = first(product.vendor.negociationAgreements);

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

  private async getOngoingPriceOffer(buyerId: UUID, productId: UUID) {
    const ongoingOffer = await this.prisma.priceOffer.findFirst({
      where: {
        buyerId: buyerId.uuid,
        productId: productId.uuid,
        status: PriceOfferStatus.PROPOSED,
      },
    });

    return ongoingOffer;
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
        productVariant: { select: { product: { select: { vendorId: true } } } },
      },
    });

    return [
      priceOffer.buyerId,
      priceOffer.productVariant?.product.vendorId,
    ].includes(userId.uuid);
  }

  private async sendMessageToConversation(
    priceOfferId: UUID,
    userId: UUID,
    message: string,
  ): Promise<void> {
    const conversationId = await this.getAssociatedConversationId(priceOfferId);
    const { chatId } = await this.prisma.customer.findUniqueOrThrow({
      where: { authUserId: userId.uuid },
    });

    await this.chatService.writeMessage(chatId, message, conversationId);
  }

  private async getAssociatedConversationId(priceOfferId: UUID) {
    const { product: priceOfferProduct, buyerId } =
      await this.prisma.priceOffer.findUniqueOrThrow({
        where: {
          id: priceOfferId.uuid,
        },
        select: {
          buyerId: true,
          product: { select: { id: true } },
        },
      });

    if (!priceOfferProduct) {
      throw new PriceOfferNotFound(priceOfferId);
    }

    const { conversationId } =
      await this.chatService.getOrCreateConversationFromAuthUserId(
        new UUID({ uuid: buyerId }),
        new UUID({ uuid: priceOfferProduct.id }),
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
    const isInitiatedByBuyer = buyer.authUserId === priceOffer.initiatedBy;

    return await sendEmailToParticipants(
      {
        [Participants.BUYER]: buyerParticipant,
        [Participants.SELLER]: sellerParticipant,
        [Participants.INITIATOR]: isInitiatedByBuyer
          ? buyerParticipant
          : sellerParticipant,
        [Participants.RECEIVER]: isInitiatedByBuyer
          ? sellerParticipant
          : buyerParticipant,
      },
      conversationId,
    );
  }
}
