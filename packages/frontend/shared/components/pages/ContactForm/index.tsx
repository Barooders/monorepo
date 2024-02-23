import PageContainer from '@/components/atoms/PageContainer';
import { getDictionary } from '@/i18n/translate';
import Script from 'next/script';

const dict = getDictionary('fr');

const ContactForm = () => (
  <PageContainer size="medium">
    <h1 className="mt-3 mb-8 text-center text-3xl font-semibold">
      {dict.contactUs.title}
    </h1>
    <div data-gorgias-contact-form-uid="w0he5t4w"></div>
    <Script
      strategy="afterInteractive"
      src="https://contact.gorgias.help/api/contact-forms/loader.js?v=2"
      data-gorgias-loader-contact-form
    />
  </PageContainer>
);

export default ContactForm;
