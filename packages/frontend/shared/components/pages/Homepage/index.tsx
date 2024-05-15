import { fetchStrapiGraphQL } from '@/clients/strapi';
import HomeJsonLd from '@/components/atoms/JsonLd/HomeJsonLd';
import SnowFall from '@/components/molecules/Snowfall';
import { getDictionary } from '@/i18n/translate';
// eslint-disable-next-line no-restricted-imports
import { gql } from '@apollo/client';
import MainHeader from '../Builder/_components/MainHeader';

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
      <h1 className="hidden">{dict.homepage.mainTitle}</h1>
      <HomeJsonLd />
    </>
  );
};

export default HomePage;
