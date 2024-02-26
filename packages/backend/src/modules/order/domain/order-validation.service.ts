import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { Injectable, Logger } from '@nestjs/common';
import { ISupportCenterClient } from './ports/support-center.client';

export enum InvalidOrderReason {
  OPEN_SUPPORT_TICKET = 'OPEN_SUPPORT_TICKET',
}

export interface Reason {
  type: InvalidOrderReason;
  message: string;
  link?: string;
}

export interface OrderValidation {
  isValid: boolean;
  reasons: Reason[];
}

@Injectable()
export class OrderValidationService {
  private readonly logger: Logger = new Logger(OrderValidationService.name);

  constructor(
    private supportCenterClient: ISupportCenterClient,
    private prisma: PrismaMainClient,
  ) {}

  async isOrderValid(orderId: string): Promise<OrderValidation> {
    const { customerEmail } = await this.prisma.order.findUniqueOrThrow({
      where: { id: orderId },
    });
    const openTickets =
      await this.supportCenterClient.getOpenTickets(customerEmail);

    return {
      isValid: openTickets.length === 0,
      reasons: [
        ...openTickets.map(({ title, url }) => ({
          type: InvalidOrderReason.OPEN_SUPPORT_TICKET,
          message: title,
          link: url,
        })),
      ],
    };
  }
}
