import envConfig from '@config/env/env.config';
import { jsonStringify } from '@libs/helpers/json';
import { createHttpClient } from '@libs/infrastructure/http/clients';
import { IMarketingClient } from '@modules/customer/domain/ports/marketing.client';
import { Injectable } from '@nestjs/common';

@Injectable()
export class KlaviyoClient implements IMarketingClient {
  async deleteProfile(clientEmail: string) {
    const client = this.createKlaviyoClient();

    await client('/data-privacy-deletion-jobs', {
      method: 'POST',
      body: jsonStringify({
        data: {
          type: 'data-privacy-deletion-job',
          attributes: {
            profile: {
              data: {
                type: 'profile',
                attributes: {
                  email: clientEmail,
                },
              },
            },
          },
        },
      }),
    });
  }

  createKlaviyoClient() {
    return createHttpClient('https://a.klaviyo.com/api', {
      headers: {
        Authorization: `Klaviyo-API-Key ${envConfig.externalServices.klaviyo?.apiKey}`,
        accept: 'application/json',
        'content-type': 'application/json',
        revision: '2024-02-15',
      },
    });
  }
}
