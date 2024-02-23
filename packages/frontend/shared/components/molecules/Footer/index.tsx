import Link from '@/components/atoms/Link';
import { getDictionary } from '@/i18n/translate';
import { AiOutlineMail } from 'react-icons/ai';
import SocialIcons from '../SocialIcons';
import FooterSection from './FooterSection';

type FooterSection = {
  label: string;
  url: string;
}[];

const Footer = () => {
  const footerLabels = getDictionary('fr').footer;
  const footerSections = [
    {
      title: footerLabels.about.title,
      links: [
        {
          label: footerLabels.about.links.blog,
          url: '/blogs/infos',
        },
        {
          label: footerLabels.about.links.joinUs,
          url: 'https://www.welcometothejungle.com/fr/companies/barooders',
        },
        {
          label: footerLabels.about.links.myAccount,
          url: '/account',
        },
      ],
    },
    {
      title: footerLabels.sell.title,
      links: [
        {
          label: footerLabels.sell.links.iSell,
          url: '/account',
        },
        {
          label: footerLabels.sell.links.qnaSeller,
          url: 'https://support-barooders.gorgias.help/fr-FR/articles/faq--vous-etes-vendeur-23764',
        },
        {
          label: footerLabels.sell.links.becomePartner,
          url: '/content/vendeur-pro',
        },
      ],
    },
    {
      title: footerLabels.buyer.title,
      links: [
        {
          label: footerLabels.buyer.links.qnaBuyer,
          url: 'https://support-barooders.gorgias.help/fr-FR/articles/faq--vous-etes-acheteur-23763',
        },
        {
          label: footerLabels.buyer.links.giftCard,
          url: '/products/carte-cadeau',
        },
      ],
    },
    {
      title: footerLabels.help.title,
      links: [
        {
          label: footerLabels.help.links.qna,
          url: 'https://support-barooders.gorgias.help/fr-FR',
        },
        {
          label: footerLabels.help.links.legalMentions,
          url: '/policies/legal-notice',
        },
        {
          label: footerLabels.help.links.privacy,
          url: '/policies/privacy-policy',
        },
        {
          label: footerLabels.help.links.refunding,
          url: '/policies/refund-policy',
        },
        {
          label: footerLabels.help.links.generalConditions,
          url: '/policies/terms-of-service',
        },
      ],
    },
    {
      title: footerLabels.application.title,
      links: [
        {
          label: footerLabels.application.links.apple,
          url: 'https://apps.apple.com/fr/app/barooders-le-sport-doccasion/id6444026059',
        },
        {
          label: footerLabels.application.links.android,
          url: 'https://play.google.com/store/apps/details?id=com.barooders',
        },
      ],
    },
  ];
  return (
    <div
      className="bg-secondary-200"
      id="barooders-main-footer"
    >
      <div className="border border-y-black py-12 px-8">
        <div className="mx-auto flex max-w-page-content flex-wrap justify-between px-4">
          {footerSections.map((footerSection) => (
            <FooterSection
              key={footerSection.title}
              title={footerSection.title}
            >
              <ul className="mb-5 font-light">
                {footerSection.links.map((link) => (
                  <li
                    key={link.label}
                    className="mb-2"
                  >
                    <Link href={link.url}>{link.label}</Link>
                  </li>
                ))}
              </ul>
            </FooterSection>
          ))}
          <FooterSection title={footerLabels.contactUs.title}>
            <div className="flex items-center gap-2">
              <AiOutlineMail />{' '}
              <Link
                href="/contact-us"
                className="underline"
              >
                {footerLabels.contactUs.links.email}
              </Link>
            </div>
            <div className="mt-5">
              <FooterSection title={footerLabels.followUs.title}>
                <div className="flex gap-3 text-2xl">
                  <SocialIcons />
                </div>
              </FooterSection>
            </div>
          </FooterSection>
        </div>
      </div>
      <div className="py-4 text-center">© 2023 Barooders</div>
    </div>
  );
};

export default Footer;
