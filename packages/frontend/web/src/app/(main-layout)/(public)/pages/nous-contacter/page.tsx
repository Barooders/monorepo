import ContactForm from '@/components/pages/ContactForm';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

export const metadata = {
  title: dict.contactUs.title,
};

const ContactUsPage = () => <ContactForm />;

export default ContactUsPage;
