import ErrorPanel from '@/components/atoms/ErrorPanel';
import CollectionJsonLd from '@/components/atoms/JsonLd/CollectionJsonLd';
import SearchPage, {
  getData as getSearchPageData,
  GetDataType as SearchPagePropsType,
} from '@/components/pages/SearchPage';
import Filters from '@/components/molecules/Filters';
import InstantSearchProvider from '@/components/pages/SearchPage/_components/InstantSearchProvider';
import { searchCollections } from '@/config';
import config from '@/config/env/index';
import { metadataConfig } from '@/document/metadata/global';
import useSentry from '@/hooks/useSentry';
import { getDictionary } from '@/i18n/translate';
import { extractQueryParam } from '@/utils/extractQueryParam';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import { renderToString } from 'react-dom/server';
import { getServerState } from 'react-instantsearch-hooks-server';
import {
  InstantSearchServerState,
  InstantSearchSSRProvider,
} from 'react-instantsearch-hooks-web';

type PropsType = {
  serverUrl: string;
  serverState: InstantSearchServerState | null;
  searchPageProps: SearchPagePropsType;
  collectionHandle: string;
  vendorSellerName: string;
};

const dict = getDictionary('fr');

export const getServerSideProps: GetServerSideProps<
  PropsType,
  { collectionHandle: string }
> = async ({ req, params, query }) => {
  if (!params?.collectionHandle)
    throw new Error('Need to provide a collectionHandle');

  const collectionHandle = params?.collectionHandle;
  const vendorSellerName = extractQueryParam(query?.q);
  const productHandle = extractQueryParam(query?.handle);
  const productVariantShopifyId = extractQueryParam(query?.variant);
  const searchPageProps = await getSearchPageData({
    collectionHandle,
    productHandle,
    productVariantShopifyId,
    vendorSellerName,
  });

  // eslint-disable-next-line react-hooks/rules-of-hooks
  const Sentry = useSentry();

  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  if (
    !searchPageProps.collectionData?.id &&
    !searchPageProps.vendorInfo?.sellerName
  ) {
    return {
      props: {
        serverUrl,
        serverState: null,
        searchPageProps,
        collectionHandle,
        vendorSellerName,
      },
    };
  }

  let serverState = null;
  try {
    serverState = await getServerState(
      <CollectionPage
        serverState={null}
        serverUrl={serverUrl}
        searchPageProps={searchPageProps}
        collectionHandle={collectionHandle}
        vendorSellerName={vendorSellerName}
      />,
      { renderToString },
    );
  } catch (e) {
    Sentry.captureException(e);
    console.error(e);

    if (process.env.NEXT_PUBLIC_BAROODERS_ENV !== 'production') throw e;
  }

  return {
    props: {
      serverUrl,
      serverState,
      searchPageProps,
      collectionHandle,
      vendorSellerName,
    },
  };
};

const CollectionPage: React.FC<PropsType> = ({
  serverState,
  serverUrl,
  searchPageProps,
  collectionHandle,
  vendorSellerName,
}) => {
  if (
    !searchPageProps.collectionData?.id &&
    !searchPageProps.vendorInfo?.sellerName
  ) {
    return (
      <ErrorPanel description={dict.global.errors.collectionNotFoundError} />
    );
  }
  const canonicalUrl = new URL(
    `${config.baseUrl}/collections/${collectionHandle}`,
  );
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
      <InstantSearchSSRProvider {...serverState}>
        {serverState === null ? (
          <InstantSearchProvider
            collectionName={searchCollections.products.main}
            serverUrl={serverUrl}
            filters={searchPageProps.filters}
            query={searchPageProps.query}
            ruleContexts={[
              searchPageProps.collectionData
                ? searchPageProps.collectionData.handle
                : searchPageProps.vendorInfo?.sellerName ?? '',
            ]}
          >
            <Filters />
          </InstantSearchProvider>
        ) : (
          <SearchPage
            {...searchPageProps}
            serverUrl={serverUrl}
          />
        )}
      </InstantSearchSSRProvider>
      <CollectionJsonLd
        canonicalUrl={canonicalUrl}
        title={metadata.title}
        description={metadata.description}
      />
    </>
  );
};

export default CollectionPage;
