import {
  AggregateName,
  PrismaMainClient,
} from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { EventEmitter2 } from '@nestjs/event-emitter';
import { CustomerRequestCreatedEvent } from './events/customer-request.created.domain-events';
import { CustomerRequestCreationRequest } from './ports/customer-request';
import { IInternalNotificationClient } from './ports/internal-notification.client';

@Injectable()
export class CustomerRequestService {
  constructor(
    private prisma: PrismaMainClient,
    private notificationClient: IInternalNotificationClient,
    protected readonly eventEmitter: EventEmitter2,
  ) {}

  async createCustomerRequests(
    customerId: UUID,
    requests: CustomerRequestCreationRequest[],
  ) {
    await this.prisma.customerRequest.createMany({
      data: requests.map((request) => ({
        ...request,
        customerId: customerId.uuid,
      })),
    });

    this.emitCustomerRequestCreatedEvent(requests, customerId);

    await this.sendCreatedRequestCreatedNotification(customerId, requests);
  }

  private async sendCreatedRequestCreatedNotification(
    customerId: UUID,
    requests: CustomerRequestCreationRequest[],
  ) {
    const {
      sellerName: customerName,
      user: { phone_number: customerPhoneNumber, email: customerEmail },
    } = await this.prisma.customer.findUniqueOrThrow({
      where: { authUserId: customerId.uuid },
      select: {
        sellerName: true,
        user: { select: { email: true, phone_number: true } },
      },
    });

    const offerMessage = requests
      .map(
        ({
          neededAtDate,
          quantity,
          budgetMinInCents,
          budgetMaxInCents,
          description,
        }) => `
📦 *Quantité*: ${quantity}
📅 *Date de besoin*: ${neededAtDate.toLocaleDateString('fr-FR')}
💰 *Budget*:
  - Min: ${budgetMinInCents ? budgetMinInCents / 100 : 'N/A'}€
  - Max: ${budgetMaxInCents ? budgetMaxInCents / 100 : 'N/A'}€
📝 *Description*:
${description}`,
      )
      .join('\n\n');

    await this.notificationClient.sendB2BNotification(
      `🚲 *${customerName}* a enregistré un nouveau besoin

${offerMessage}

📧 Contact:  ${customerName} - ${customerEmail} - ${customerPhoneNumber}
      `,
    );
  }

  private emitCustomerRequestCreatedEvent(
    requests: CustomerRequestCreationRequest[],
    customerId: UUID,
  ) {
    requests.forEach((request) => {
      this.eventEmitter.emit(
        CustomerRequestCreatedEvent.EVENT_NAME,
        new CustomerRequestCreatedEvent({
          aggregateId: customerId.uuid,
          aggregateName: AggregateName.CUSTOMER,
          payload: {
            ...request,
            neededAtDate: request.neededAtDate.toISOString(),
          },
          metadata: {
            author: { id: customerId.uuid, type: 'user' },
          },
        }),
      );
    });
  }
}
