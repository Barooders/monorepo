import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { SearchAlertService } from '../domain/search-alert.service';
import { jsonStringify } from '@libs/helpers/json';

@Console({
  command: 'searchAlerts',
  description: 'Search Alerts CLI',
})
export class SearchAlertCLIConsole {
  private readonly logger: Logger = new Logger(SearchAlertCLIConsole.name);

  constructor(private searchAlertService: SearchAlertService) {}

  @Command({
    command: 'triggerAll',
    description: 'Fill queue with Search Alerts to trigger',
  })
  async triggerAllSearchAlerts(): Promise<void> {
    this.logger.debug('Load Search Alerts in queue');
    const result = await this.searchAlertService.triggerAllSearchAlerts();
    this.logger.debug(jsonStringify(result, 2));
  }

  @Command({
    command: 'trigger <alertId>',
    description: 'Trigger directly a single alert',
  })
  async triggerSpecificSearchAlert(alertId: string): Promise<void> {
    this.logger.debug(`Starting sync for ${alertId}`);
    await this.searchAlertService.triggerAlert(alertId);
  }
}
