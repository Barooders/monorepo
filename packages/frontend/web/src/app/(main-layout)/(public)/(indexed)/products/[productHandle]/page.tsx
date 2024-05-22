import { graphql } from '@/__generated/gql/public';
import { fetchHasura } from '@/clients/hasura';
import { fetchProductByHandle } from '@/clients/products';
import ErrorPanel from '@/components/atoms/ErrorPanel';
import { getData as getProductCardData } from '@/components/molecules/ProductCard/b2c/container';
import ProductPage from '@/components/pages/ProductPage';
import { COMMISSION_PRODUCT_TYPE } from '@/config';
import config from '@/config/env';
import { BackendFailureException } from '@/exception/backend-failure.exception';
import { ForbiddenPathException } from '@/exceptions/ForbiddenPathException';
import { ProductNotFoundException } from '@/exceptions/ProductNotFoundException';
import { getDictionary } from '@/i18n/translate';
import { AppRouterPage } from '@/types';
import capitalize from 'lodash/capitalize';
import { Metadata } from 'next';

type CollectionType = {
  id: string;
  shopifyId: string;
  handle: string;
  shortName: string | null;
  title: string | null;
};

type PageProps = {
  params: { productHandle: string };
  searchParams: { variant: string };
};

export type ProductDTO = {
  id: string;
  breadcrumbs: CollectionType[];
};

const dict = getDictionary('fr');

const FETCH_PRODUCT_METADATA = /* GraphQL */ /* typed_for_public */ `
  query fetchProductMetadata($productHandle: String) {
    shopify {
      product(handle: $productHandle) {
        productType
        featuredImage {
          src
          width
          height
        }
        seo {
          description
          title
        }
      }
    }
  }
`;

const FORBIDDEN_PATTERNS = [
  /\.json$/,
  /garantie-barooders-/,
  /response\.write/,
  /nslookup /,
  /curl /,
  /wget /,
  /ping /,
  /traceroute /,
  /telnet /,
  /nc /,
  /\(/,
  /\)/,
  /bxss/,
  /%/,
];

const isForbiddenProductName = (productHandle: string) =>
  FORBIDDEN_PATTERNS.some((pattern) => productHandle.match(pattern) !== null);

export async function generateMetadata({
  params,
  searchParams,
}: PageProps): Promise<Metadata> {
  if (isForbiddenProductName(params.productHandle)) {
    return {
      robots: {
        index: false,
      },
    };
  }

  const canonical = new URL(
    `${config.baseUrl}/products/${params.productHandle}`,
  );

  if (searchParams.variant) {
    canonical.searchParams.append('variant', String(searchParams.variant));
  }

  let shouldIndex = true;
  let seoData: { description: string | null; title: string | null } = {
    description: null,
    title: null,
  };
  let featuredImage = null;
  try {
    const result = await fetchHasura(graphql(FETCH_PRODUCT_METADATA), {
      variables: { productHandle: params.productHandle },
    });

    const productMetadata = result.shopify?.product;
    shouldIndex = productMetadata?.productType !== COMMISSION_PRODUCT_TYPE;
    featuredImage = productMetadata?.featuredImage ?? null;
    if (productMetadata?.seo) seoData = productMetadata?.seo;
  } catch (e) {
    console.error(
      `Could not fetch product metadata for product ${params.productHandle}`,
    );
  }

  return {
    title:
      seoData.title ?? capitalize(params.productHandle.split('-').join(' ')),
    description: seoData.description,
    alternates: {
      canonical,
    },
    openGraph: {
      siteName: dict.homepage.head.title,
      url: canonical,
      description: seoData.description ?? '',
      title: seoData.title ?? '',
      images: [
        {
          url: featuredImage?.src,
          width: String(featuredImage?.width),
          height: String(featuredImage?.height),
        },
      ],
    },
    twitter: {
      site: '@',
      title: seoData.title ?? '',
      description: seoData.description ?? '',
    },
    robots: {
      index: shouldIndex,
    },
  };
}

const ProductPagePage: AppRouterPage<
  PageProps['params'],
  PageProps['searchParams']
> = async ({ params, searchParams }: PageProps) => {
  let productCardProps;
  let productByHandle: ProductDTO | null = null;

  try {
    if (isForbiddenProductName(params.productHandle)) {
      throw new ForbiddenPathException(params.productHandle);
    }

    [productCardProps, productByHandle] = await Promise.all([
      getProductCardData({
        productHandle: params.productHandle,
        productVariantShopifyId: searchParams.variant,
      }),
      fetchProductByHandle(params.productHandle),
    ]);
  } catch (e: unknown) {
    if (
      e instanceof ProductNotFoundException ||
      e instanceof ForbiddenPathException ||
      (e instanceof BackendFailureException && e.statusCode === 404)
    ) {
      return (
        <ErrorPanel description={dict.global.errors.productNotFoundError} />
      );
    }

    throw e;
  }

  return (
    <ProductPage
      productCardProps={productCardProps}
      productByHandle={productByHandle}
    />
  );
};

export default ProductPagePage;
