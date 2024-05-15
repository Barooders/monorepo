import {
  AggregateName,
  Dispute,
  DisputeStatus,
  EventName,
  OrderStatus,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { Amount, UUID } from '@libs/domain/value-objects';
import { PaymentAccountProviderService } from '@modules/customer/domain/payment-account-provider.service';
import { OrderUpdateService } from '@modules/order/domain/order-update.service';
import { Injectable, Logger } from '@nestjs/common';
import { CommissionService } from './commission.service';
import { IPaymentProvider } from './ports/payment-provider';

export interface Payout {
  vendorId: string;
  vendorPaymentProviderId: string;
  amountInCents: number;
  orderLineId: string;
}
@Injectable()
export class PayoutService {
  private readonly logger: Logger = new Logger(PayoutService.name);

  constructor(
    private paymentAccountProvider: PaymentAccountProviderService,
    private paymentProvider: IPaymentProvider,
    private commissionService: CommissionService,
    private prisma: PrismaMainClient,
    private orderUpdateService: OrderUpdateService,
  ) {}

  async executePayoutForOrderLine(
    orderLineId: string,
    vendorId: string,
    author: Author,
    manualAmount: Amount | null = null,
    comment = '',
    force = false,
  ): Promise<void> {
    const {
      order: { id: orderId, name: orderName, createdAt: orderCreatedAt },
      disputes,
    } = await this.prisma.orderLines.findUniqueOrThrow({
      where: {
        id: orderLineId,
      },
      include: {
        order: true,
        disputes: true,
      },
    });

    if (!force) {
      this.throwIfOrderLineHaveOpenDisputes(disputes);
      await this.throwIfOrderLineHasAlreadyBeenPaidOut(orderLineId);
    }

    const payoutAmount =
      manualAmount ??
      (await this.calculatePayoutAmount(new UUID({ uuid: orderLineId })));

    const vendorPaymentAccount =
      await this.paymentAccountProvider.getPaymentAccount(vendorId);

    const executePayment = async () => {
      await this.paymentProvider.executePayment(
        vendorPaymentAccount.accountId,
        payoutAmount,
        `Vente Barooders (${orderName}) du ${orderCreatedAt.toLocaleString()}`,
      );

      const payout = {
        vendorId,
        vendorPaymentProviderId: vendorPaymentAccount.accountId,
        amountInCents: payoutAmount.amountInCents,
        orderLineId,
      };

      await this.prisma.payout.create({
        data: {
          amountInCents: payoutAmount.amountInCents,
          orderLineId,
          destinationAccountId: vendorPaymentAccount.id,
          comment,
        },
      });

      await this.prisma.event.create({
        data: {
          aggregateName: AggregateName.PAYOUT,
          aggregateId: vendorId,
          name: EventName.VENDOR_PAYOUT,
          payload: payout,
          metadata: {
            author,
            comment,
          },
        },
      });
    };

    if (force) {
      await executePayment();
    } else {
      await this.orderUpdateService.triggerActionsAndUpdateOrderStatus(
        orderId,
        OrderStatus.PAID_OUT,
        author,
        new Date(),
        executePayment,
      );
    }
  }

  private async calculatePayoutAmount(orderLineId: UUID): Promise<Amount> {
    const { variantPrice, variantDiscount, vendorCommission, vendorShipping } =
      await this.commissionService.getCommissionByOrderLine(orderLineId.uuid);
    return new Amount({
      amountInCents: Math.round(
        (vendorCommission + vendorShipping + variantPrice - variantDiscount) *
          100,
      ),
    });
  }

  private throwIfOrderLineHaveOpenDisputes(disputes: Dispute[]) {
    if (
      disputes.filter(({ status }) => status === DisputeStatus.OPEN).length ===
      0
    )
      return;

    throw new Error('Cannot execute payout for order line with open dispute');
  }

  private async throwIfOrderLineHasAlreadyBeenPaidOut(orderLineId: string) {
    const payout = await this.prisma.payout.findMany({
      where: {
        orderLineId,
      },
    });

    if (payout.length > 0)
      throw new Error(
        `Order line was already paid out with payouts: (${payout
          .map(({ id }) => id)
          .join(',')})`,
      );
  }
}
