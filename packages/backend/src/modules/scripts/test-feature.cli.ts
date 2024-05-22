import { KlaviyoClient } from '@modules/customer/infrastructure/marketing/klaviyo.client';
import { Logger } from '@nestjs/common';
import { Command, Console } from 'nestjs-console';

@Console()
export class TestFeatureCLI {
  private readonly logger: Logger = new Logger(TestFeatureCLI.name);

  constructor(private klaviyoClient: KlaviyoClient) {}

  @Command({
    command: 'testKlaviyoSubscription <userEmail>',
  })
  async testKlaviyoSubscription(userEmail: string): Promise<void> {
    await this.klaviyoClient.createProfile(userEmail, 'Nico', 'Ngo');
  }
}
