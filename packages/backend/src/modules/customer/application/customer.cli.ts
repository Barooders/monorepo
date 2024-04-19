import { PrismaMainClient } from '@libs/domain/prisma.main.client';
import { UUID } from '@libs/domain/value-objects';
import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { CustomerService } from '../domain/customer.service';

@Console({
  command: 'customer',
  description: 'Customer CLI',
})
export class CustomerCLIConsole {
  private readonly logger: Logger = new Logger(CustomerCLIConsole.name);

  constructor(
    private customerService: CustomerService,
    private mainPrisma: PrismaMainClient,
  ) {}

  @Command({
    command: 'anonymize <email>',
    description:
      'Anonymize user account when a user want to have its info removed',
  })
  async anonymizeUser(email: string): Promise<void> {
    const userToAnonymize = await this.mainPrisma.users.findUniqueOrThrow({
      where: { email },
      select: { id: true },
    });

    await this.customerService.anonymizeCustomerAccount(
      new UUID({ uuid: userToAnonymize.id }),
    );
  }
}
