import { MutexService } from '@libs/domain/mutex.service';
import {
  AggregateName,
  Currency,
  EventName,
  Order,
  OrderLines,
  OrderStatus,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { Author } from '@libs/domain/types';
import { Injectable, Logger } from '@nestjs/common';
import { pickBy } from 'lodash';
import { OrderStatusHandlerService } from './order-status-handler.service';
import { OrderStatusUpdateNotAllowed } from './ports/exceptions';

type OrderToUpdate = {
  shopifyId: string;
  name: string;
  status: OrderStatus;
  createdAt: Date;
  customerEmail: string;
  customerId: string | null;
  totalPriceInCents: number;
  totalPriceCurrency: Currency;
  shippingAddressAddress1: string;
  shippingAddressAddress2: string | null;
  shippingAddressCity: string;
  shippingAddressCountry: string;
  shippingAddressFirstName: string;
  shippingAddressLastName: string;
  shippingAddressZip: string;
  shippingAddressPhone?: string;
};

type UpdatedOrder = (Order & { orderLines: OrderLines[] }) | undefined;

const ALLOWED_PREVIOUS_STATUSES: { [key in OrderStatus]?: OrderStatus[] } = {
  [OrderStatus.PAID]: [OrderStatus.CREATED],
  [OrderStatus.LABELED]: [OrderStatus.PAID],
  [OrderStatus.PAID_OUT]: [OrderStatus.DELIVERED],
  [OrderStatus.SHIPPED]: [OrderStatus.PAID, OrderStatus.LABELED],
  [OrderStatus.DELIVERED]: [
    OrderStatus.PAID,
    OrderStatus.SHIPPED,
    OrderStatus.LABELED,
  ],
  [OrderStatus.CANCELED]: [
    OrderStatus.CREATED,
    OrderStatus.LABELED,
    OrderStatus.PAID,
    OrderStatus.SHIPPED,
    OrderStatus.DELIVERED,
    OrderStatus.RETURNED,
    OrderStatus.PAID_OUT,
  ],
};

@Injectable()
export class OrderUpdateService {
  private readonly logger = new Logger(OrderUpdateService.name);

  constructor(
    private prisma: PrismaMainClient,
    private orderStatusHandler: OrderStatusHandlerService,
    private mutexService: MutexService,
  ) {}

  async triggerActionsAndUpdateOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    author: Author,
    updatedAt: Date = new Date(),
    actionsCallback?: () => Promise<void>,
  ): Promise<void> {
    await this.propagateNewOrderStatus(
      orderId,
      newStatus,
      author,
      updatedAt,
      async (storedOrder: Order) => {
        await this.checkIfOrderStatusCanBeUpdated(
          storedOrder.id,
          newStatus,
          storedOrder.status,
        );
        if (actionsCallback) {
          await actionsCallback();
        }
      },
    );
  }

  private async propagateNewOrderStatus(
    orderId: string,
    newStatus: OrderStatus,
    author: Author,
    updatedAt: Date,
    callback?: (storedOrder: Order) => Promise<void>,
  ) {
    await this.mutexService.runCallbackInSingleThread(orderId, async () => {
      const storedOrder = await this.prisma.order.findUniqueOrThrow({
        where: {
          id: orderId,
        },
      });

      if (callback) {
        await callback(storedOrder);
      }

      await this.updateOrderInDatabase(
        storedOrder,
        { status: newStatus },
        author,
      );
      await this.orderStatusHandler.handleNewOrderStatus(
        orderId,
        newStatus,
        storedOrder.status,
        author,
        updatedAt,
      );
    });
  }

  private async checkIfOrderStatusCanBeUpdated(
    orderId: string,
    newStatus: OrderStatus,
    oldStatus: OrderStatus,
  ) {
    const allowedPreviousStatuses = ALLOWED_PREVIOUS_STATUSES[newStatus];

    if (allowedPreviousStatuses?.includes(oldStatus)) return;

    throw new OrderStatusUpdateNotAllowed(orderId, newStatus, oldStatus);
  }

  private async updateOrderInDatabase(
    storedOrder: Order,
    { createdAt: _, ...orderToUpdate }: Partial<Order>,
    author: Author,
  ): Promise<UpdatedOrder | void> {
    const { shopifyId, name, id } = storedOrder;

    this.logger.debug(`Updating order ${shopifyId}`);

    const concreteUpdates: Omit<Partial<OrderToUpdate>, 'createdAt'> = pickBy(
      orderToUpdate,
      (value, key) => {
        return value !== storedOrder[key as keyof OrderToUpdate];
      },
    );

    if (Object.keys(concreteUpdates).length === 0) return;

    const updatedOrder = await this.prisma.order.update({
      where: { shopifyId },
      data: concreteUpdates,
      include: { orderLines: true },
    });

    await this.prisma.event.create({
      data: {
        aggregateName: AggregateName.ORDER,
        aggregateId: id,
        name: EventName.ORDER_UPDATED,
        payload: {
          concreteUpdates,
        },
        metadata: {
          orderName: name,
          author,
        },
      },
    });

    return updatedOrder;
  }
}
