import envConfig from '@config/env/env.config';
import { IInternalTrackingClient } from '@modules/price-offer/domain/ports/internal-tracking.client';
import { Injectable, Logger } from '@nestjs/common';
import Airtable from 'airtable';

const B2B_TABLE = 'Offres';
const B2B_OFFER_COMMENT_FIELD = 'Commentaire';

@Injectable()
export class AirtableClient implements IInternalTrackingClient {
  private readonly logger: Logger = new Logger(AirtableClient.name);

  async createB2BOffer(message: string): Promise<void> {
    const config = envConfig.externalServices.airtable;

    if (!config) {
      this.logger.warn('Airtable configuration is missing, skipping.');
      return;
    }

    const base = new Airtable({ apiKey: config.secretApiToken }).base(
      config.appId,
    );

    base(B2B_TABLE).create(
      [
        {
          fields: {
            [B2B_OFFER_COMMENT_FIELD]: message,
          },
        },
      ],
      (err, records) => {
        if (err) {
          throw err;
        }
        records?.forEach((record) => {
          this.logger.warn('Airtable record created', record.getId());
        });
      },
    );
  }
}
