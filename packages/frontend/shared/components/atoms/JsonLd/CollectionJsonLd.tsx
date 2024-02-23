import { getUrlByFormat } from '@/components/atoms/Image';
import { Url } from '@/types';

type PropsType = {
  title: string;
  canonicalUrl: URL;
  image?: {
    src: Url;
  };
  description: string;
};

const CollectionJsonLd = ({
  title,
  canonicalUrl,
  image,
  description,
}: PropsType) => {
  const jsonLd = {
    '@context': 'http://schema.org/',
    '@type': 'CollectionPage',
    name: title,
    url: canonicalUrl,
    description: description,
    image: image ? getUrlByFormat(image.src, 'medium') : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default CollectionJsonLd;
