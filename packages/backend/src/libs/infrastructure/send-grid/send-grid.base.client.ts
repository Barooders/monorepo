import envConfig from '@config/env/env.config';
import { jsonStringify } from '@libs/helpers/json';

type EmailReceiver = {
  email: string;
  name?: string;
};

export const BAROODERS_SUPPORT_RECIPIENT = {
  email: 'support@barooders.com',
  name: 'Support Barooders',
};
export const BAROODERS_OPERATIONS_RECIPIENT = {
  email: 'operations@barooders.com',
  name: 'Opérations Barooders',
};
export const BAROODERS_NOTIFICATIONS_RECIPIENT = {
  email: 'notifications@barooders.com',
  name: 'Barooders',
};

export const sendEmailFromTemplate = async (
  sendTo: EmailReceiver[],
  templateId: string,
  templateData: Record<string, unknown>,
  replyTo?: EmailReceiver,
  copyTo?: EmailReceiver[],
): Promise<void> => {
  const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${envConfig.externalServices.sendgridApiKey}`,
    },
    body: jsonStringify({
      from: BAROODERS_NOTIFICATIONS_RECIPIENT,
      ...(replyTo && { reply_to: replyTo }),
      personalizations: [
        {
          to: sendTo,
          ...(copyTo && { cc: copyTo }),
          dynamic_template_data: templateData,
        },
      ],
      template_id: templateId,
    }),
  });

  if (!response.ok) {
    const errors = await response.json();

    throw new Error(
      `Cannot send email to (${jsonStringify(sendTo)}): ${
        response.statusText
      }. The following errors were returned: ${jsonStringify(errors)}`,
    );
  }
};
