import { Logger } from '@nestjs/common';
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
    await this.storeClient.cleanOldCommissions();
  }
}
