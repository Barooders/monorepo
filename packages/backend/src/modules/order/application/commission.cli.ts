import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { CommissionService } from '../domain/commission.service';

@Console({
  command: 'commission',
  description: 'Commission CLI',
})
export class CommissionCLIConsole {
  private readonly logger: Logger = new Logger(CommissionCLIConsole.name);

  constructor(private commissionService: CommissionService) {}

  @Command({
    command: 'cleanOldCommissions',
    description: 'Delete product commissions that are older than 7 days',
  })
  async createExternalOrders(): Promise<void> {
    await this.commissionService.cleanOldCommissions();
  }
}
