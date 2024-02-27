import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';
import { NotificationService } from '../domain/notification.service';

@Console({
  command: 'product',
  description: 'Product CLI',
})
export class ProductCLIConsole {
  private readonly logger: Logger = new Logger(ProductCLIConsole.name);

  constructor(private notificationService: NotificationService) {}

  @Command({
    command: 'sendEmailToVendorsWithOldProducts',
    description: 'Send email to all vendors with old active products',
  })
  async sendEmailToVendorsWithOldProducts(): Promise<void> {
    await this.notificationService.notifyVendorsWithOldProducts();
  }
}
