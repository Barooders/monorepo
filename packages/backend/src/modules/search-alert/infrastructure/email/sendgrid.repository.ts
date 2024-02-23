import { sendEmailFromTemplate } from '@libs/infrastructure/send-grid/send-grid.base.client';
import { EmailRepository } from '@modules/search-alert/domain/ports/email-repository';

export class SendgridRepository implements EmailRepository {
  async sendSearchAlertResults(
    toEmail: string,
    payload: {
      alertName: string;
      countResults: number;
      searchFilters: string;
      results: {
        imageUrl: string;
        brand: string;
        handle: string;
        characteristics: string;
        price: string;
        compareAtPrice: string;
        discount: string;
      }[];
    },
  ): Promise<void> {
    const NEW_RESULTS_TEMPLATE_ID = 'd-0e5bbcd3b7a84e26987e8682bd3896ce';
    await sendEmailFromTemplate(
      [{ email: toEmail }],
      NEW_RESULTS_TEMPLATE_ID,
      payload,
    );
  }
}
