import { fetchStrapiGraphQL } from '@/clients/strapi';
import HomeJsonLd from '@/components/atoms/JsonLd/HomeJsonLd';
import SnowFall from '@/components/molecules/Snowfall';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client'; // eslint-disable-line no-restricted-imports
import BlockContent from '../Builder/_components/BlockContent';
import BlogPosts from '../Builder/_components/BlogPosts';
import BuyBackSection from '../Builder/_components/BuyBackSection';
import CollectionPreview from '../Builder/_components/CollectionPreview';
import MainHeader from '../Builder/_components/MainHeader';
import TopBrands from '../Builder/_components/TopBrands';
import TopCategories from '../Builder/_components/TopCategories';
import Trustpilot from '../Builder/_components/Trustpilot';
import WhyBarooders from '../Builder/_components/WhyBarooders';

const dict = getDictionary('fr');

export type PropsType = {
  header: {
    images: {
      image: string;
      link: string;
    }[];
  };
};

const FETCH_HOMEPAGE_CONFIG = gql`
  query {
    webHome {
      data {
        attributes {
          Header {
            ... on ComponentMediaImageSection {
              link
              image {
                data {
                  attributes {
                    url
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

export const getData = async (): Promise<PropsType> => {
  const content = await fetchStrapiGraphQL<
    {
      webHome: {
        data: {
          attributes: {
            Header: {
              link: string;
              image: {
                data: {
                  attributes: {
                    url: string;
                  };
                };
              };
            }[];
          };
        };
      };
    },
    unknown
  >(FETCH_HOMEPAGE_CONFIG, {});

  const images = content.webHome.data.attributes.Header.map((item) => ({
    image: item.image.data.attributes.url,
    link: item.link,
  }));

  return { header: { images } };
};

const HomePage: React.FC<PropsType> = ({ header }) => {
  return (
    <>
      <div className="z-10">
        <SnowFall />
      </div>
      <MainHeader
        mainSlide={header.images[0]}
        desktopSlides={header.images.slice(1)}
        mobileSlides={header.images.slice(1)}
      />
      <BlockContent
        title={dict.homepage.hotdeals.subtitle}
        subtitle={dict.homepage.hotdeals.title}
        button={{
          label: dict.homepage.hotdeals.buttonLabel,
          link: '/collections/hot-deals',
        }}
      >
        <CollectionPreview collectionHandle="hot-deals" />
      </BlockContent>
      <BlockContent title={dict.homepage.topCategories}>
        <TopCategories />
      </BlockContent>
      <BlockContent title={dict.homepage.topCategories}>
        <TopBrands />
      </BlockContent>
      <BlockContent title={dict.homepage.whyBarooders.title}>
        <WhyBarooders />
      </BlockContent>
      <BuyBackSection />
      <BlockContent
        title={dict.homepage.ebikes.title}
        button={{
          label: dict.homepage.ebikes.buttonLabel,
          link: '/collections/velos-electriques',
        }}
      >
        <CollectionPreview collectionHandle="velos-electriques" />
      </BlockContent>
      <BlockContent>
        <Trustpilot />
      </BlockContent>
      <BlockContent
        title={dict.homepage.blog.title}
        subtitle={dict.homepage.blog.subtitle}
        button={{ label: dict.homepage.blog.buttonLabel, link: '/blogs/infos' }}
      >
        <BlogPosts />
      </BlockContent>
      <div id="om-pwathz06ouj24uzrdcyf-holder"></div>

      <h1 className="hidden">{dict.homepage.mainTitle}</h1>
      <HomeJsonLd />
    </>
  );
};

export default HomePage;
