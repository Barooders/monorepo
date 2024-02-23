import { OrderStatus } from '@libs/domain/prisma.main.client';

const orderStatusMapping = {
  [OrderStatus.SHIPPED]: [3, 62990, 91],
  [OrderStatus.LABELED]: [1000],
  [OrderStatus.DELIVERED]: [11, 12],
};

export const mapOrderStatus = (statusId: number): OrderStatus | null => {
  for (const [orderStatus, statusIds] of Object.entries(orderStatusMapping)) {
    if (statusIds.includes(statusId)) {
      return orderStatus as OrderStatus;
    }
  }

  return null;
};
