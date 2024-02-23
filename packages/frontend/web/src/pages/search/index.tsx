import { GetServerSideProps } from 'next';
import { extractQueryParam } from '@/utils/extractQueryParam';
import Head from 'next/head';
import config from '@/config/env/index';
import { metadataConfig } from '@/document/metadata/global';
import SearchPage, {
  GetDataType as SearchPagePropsType,
  getData as getSearchPageData,
} from '@/components/pages/SearchPage';

type PropsType = {
  serverUrl: string;
  searchQuery: string;
  searchPageProps: SearchPagePropsType;
};

export const getServerSideProps: GetServerSideProps<PropsType> = async ({
  req,
  query,
}) => {
  const searchQuery = extractQueryParam(query?.q);
  const protocol = req.headers.referer?.split('://')[0] || 'https';
  const serverUrl = `${protocol}://${req.headers.host}${req.url}`;

  const searchPageProps = await getSearchPageData({
    searchQuery,
  });

  return {
    props: {
      serverUrl,
      searchQuery,
      searchPageProps,
    },
  };
};

const CollectionPage: React.FC<PropsType> = ({
  searchQuery,
  serverUrl,
  searchPageProps,
}) => {
  const canonicalUrl = new URL(`${config.baseUrl}/search`);
  canonicalUrl.searchParams.append('q', searchQuery);

  const metadata = {
    title: metadataConfig.title,
    description: metadataConfig.description,
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
          content="noindex"
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
          content={metadataConfig.openGraph.images[0].url}
        />
        <meta
          property="og:image:secure_url"
          key="og:image:secure_url"
          content={metadataConfig.openGraph.images[0].url}
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
      <SearchPage
        {...searchPageProps}
        serverUrl={serverUrl}
      />
    </>
  );
};

export default CollectionPage;
