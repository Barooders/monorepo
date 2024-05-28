import ErrorPanel from '@/components/atoms/ErrorPanel';
import CollectionJsonLd from '@/components/atoms/JsonLd/CollectionJsonLd';
import SearchPage from '@/components/pages/SearchPage';
import { getData as getSearchPageData } from '@/components/pages/SearchPage/container';
import config from '@/config/env/index';
import { metadataConfig } from '@/document/metadata/global';
import { getDictionary } from '@/i18n/translate';
import { AppRouterPage } from '@/types';
import Head from 'next/head';

const dict = getDictionary('fr');

type PageProps = {
  params: { collectionHandle: string };
  searchParams: { q?: string; handle?: string; variant?: string };
};

const CollectionPage: AppRouterPage<
  PageProps['params'],
  PageProps['searchParams']
> = async ({ params, searchParams }) => {
  const collectionHandle = params.collectionHandle;
  const productHandle = searchParams.handle;
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  const productVariantInternalId = searchParams.variant
    ? searchParams.variant
    : undefined;
  const vendorSellerName = searchParams.q;

  const searchPageProps = await getSearchPageData({
    collectionHandle,
    productHandle,
    productVariantInternalId,
    vendorSellerName,
  });

  if (
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    !searchPageProps.collectionData?.id &&
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    !searchPageProps.vendorInfo?.sellerName
  ) {
    return (
      <ErrorPanel description={dict.global.errors.collectionNotFoundError} />
    );
  }
  const canonicalUrl = new URL(
    `${config.baseUrl}/collections/${collectionHandle}`,
  );
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (vendorSellerName) canonicalUrl.searchParams.append('q', vendorSellerName);

  const metadata = {
    title:
      searchPageProps.collectionData?.seo.title ??
      vendorSellerName ??
      metadataConfig.title,
    description:
      searchPageProps.collectionData?.seo.description ??
      metadataConfig.description,
  };

  return (
    <>
      <Head>
        <link
          rel="canonical"
          href={canonicalUrl.toString()}
        />
        <meta
          name="robots"
          content="follow"
        />
        <meta
          name="robots"
          content="index"
        />
        <title>{metadata.title}</title>
        <meta
          name="description"
          key="description"
          content={metadata.description}
        />

        <meta
          name="og:title"
          key="og:title"
          content={metadata.title}
        />
        <meta
          name="og:description"
          key="og:description"
          content={metadata.description}
        />
        <meta
          name="og:url"
          key="og:url"
          content={canonicalUrl.toString()}
        />
        <meta
          name="twitter:title"
          key="twitter:title"
          content={metadata.title}
        />
        <meta
          name="twitter:description"
          key="twitter:description"
          content={metadata.description}
        />
        <meta
          property="og:image"
          key="og:image"
          content={
            searchPageProps.collectionData?.image?.url ??
            metadataConfig.openGraph.images[0].url
          }
        />
        <meta
          property="og:image:secure_url"
          key="og:image:secure_url"
          content={
            searchPageProps.collectionData?.image?.url ??
            metadataConfig.openGraph.images[0].url
          }
        />
        <meta
          property="og:image:width"
          key="og:image:width"
          content="500"
        />
        <meta
          property="og:image:height"
          key="og:image:height"
          content="500"
        />
      </Head>
      <SearchPage {...searchPageProps} />
      <CollectionJsonLd
        canonicalUrl={canonicalUrl}
        title={metadata.title}
        description={metadata.description}
      />
    </>
  );
};

export default CollectionPage;
