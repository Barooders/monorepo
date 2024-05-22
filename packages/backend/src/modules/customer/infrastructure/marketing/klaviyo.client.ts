import envConfig from '@config/env/env.config';
import { createHttpClient } from '@libs/infrastructure/http/clients';
import { IMarketingClient } from '@modules/customer/domain/ports/marketing.client';
import { Injectable } from '@nestjs/common';

const BAROODERS_LIST_ID = 'TffwN2';

@Injectable()
export class KlaviyoClient implements IMarketingClient {
  async deleteProfile(clientEmail: string) {
    const client = this.createKlaviyoClient();

    await client('/data-privacy-deletion-jobs', {
      method: 'POST',
      data: {
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
      },
    });
  }

  async createProfile(
    clientEmail: string,
    firstName: string,
    lastName: string,
  ) {
    const client = this.createKlaviyoClient();

    await client(`/profiles`, {
      method: 'POST',
      data: {
        data: {
          type: 'profile',
          attributes: {
            email: clientEmail,
            first_name: firstName,
            last_name: lastName,
          },
        },
      },
    });

    await client('/profile-subscription-bulk-create-jobs/', {
      method: 'POST',
      data: {
        data: {
          type: 'profile-subscription-bulk-create-job',
          attributes: {
            custom_source: 'Sign up form',
            profiles: {
              data: [
                {
                  type: 'profile',
                  attributes: {
                    email: clientEmail,
                    subscriptions: {
                      email: {
                        marketing: {
                          consent: 'SUBSCRIBED',
                        },
                      },
                    },
                  },
                },
              ],
            },
          },
          relationships: {
            list: {
              data: {
                type: 'list',
                id: BAROODERS_LIST_ID,
              },
            },
          },
        },
      },
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
