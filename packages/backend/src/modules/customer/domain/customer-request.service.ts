import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { Injectable } from '@nestjs/common';
import { CustomerRequestCreationRequest } from './ports/customer-request';
import { IInternalNotificationClient } from './ports/internal-notification.client';

@Injectable()
export class CustomerRequestService {
  constructor(
    private prisma: PrismaMainClient,
    private notificationClient: IInternalNotificationClient,
  ) {}

  async createCustomerRequests(
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

    await this.prisma.customerRequest.createMany({
      data: requests.map((request) => ({
        ...request,
        customerId: customerId.uuid,
      })),
    });

    const offerMessage = requests
      .map(
        ({
          neededAtDate,
          quantity,
          budgetMinInCents,
          budgetMaxInCents,
          description,
        }) =>
          `
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
}
