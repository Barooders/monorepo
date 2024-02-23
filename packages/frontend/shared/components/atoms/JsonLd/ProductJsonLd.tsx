import { getUrlByFormat } from '@/components/atoms/Image';
import { Url } from '@/types';
import config from '@/config/env';

type PropsType = {
  title: string;
  link: Url;
  image?: {
    src: Url;
  };
  description: string;
  brand: string;
  isSoldOut: boolean;
  price: number;
};

const ProductJsonLd = ({
  title,
  link,
  image,
  description,
  brand,
  isSoldOut,
  price,
}: PropsType) => {
  const productUrl = new URL(link, config.baseUrl);
  productUrl.searchParams.delete('variant');

  const jsonLd = {
    '@context': 'http://schema.org/',
    '@type': 'Product',
    name: title,
    url: productUrl,
    description: description,
    brand: {
      '@type': 'Brand',
      name: brand,
    },
    offers: {
      '@type': 'Offer',
      availability: `http://schema.org/${isSoldOut ? 'OutOfStock' : 'InStock'}`,
      price: String(price),
      priceCurrency: 'EUR',
      url: link.toString(),
    },
    image: image ? getUrlByFormat(image.src, 'medium') : undefined,
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
    />
  );
};

export default ProductJsonLd;
