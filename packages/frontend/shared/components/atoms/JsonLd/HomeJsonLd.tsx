import config from '@/config/env';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

const HomeJsonLd = () => {
  const jsonLd = {
    '@context': 'http://schema.org/',
    '@type': 'Website',
    name: dict.homepage.head.title,
    url: `${config.baseUrl}/`,
    description: dict.global.head.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://barooders.com/search?q={query}',
      'query-input': 'required name=query',
    },
    image: `${config.baseUrl}/barooders-logo.svg`,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default HomeJsonLd;
