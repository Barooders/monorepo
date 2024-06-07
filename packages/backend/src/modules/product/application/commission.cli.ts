import { Logger } from '@nestjs/common';
import dayjs from 'dayjs';
import { Command, Console } from 'nestjs-console';
import { IStoreClient } from '../domain/ports/store.client';

@Console({
  command: 'commission',
  description: 'Commission CLI',
})
export class CommissionCLIConsole {
  private readonly logger: Logger = new Logger(CommissionCLIConsole.name);

  constructor(private storeClient: IStoreClient) {}

  @Command({
    command: 'cleanOldCommissions',
    description: 'Delete product commissions that are older than 7 days',
  })
  async createExternalOrders(): Promise<void> {
    const beforeDate = dayjs().subtract(7, 'days').toDate();
    await this.storeClient.cleanOldCommissions(beforeDate);
  }
}
