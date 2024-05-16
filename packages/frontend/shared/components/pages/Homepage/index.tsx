import { fetchStrapiGraphQL } from '@/clients/strapi';
import HomeJsonLd from '@/components/atoms/JsonLd/HomeJsonLd';
import SnowFall from '@/components/molecules/Snowfall';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client'; // eslint-disable-line no-restricted-imports
import React from 'react';
import Ambassadors from '../Builder/_components/Ambassadors';
import BlockContent from '../Builder/_components/BlockContent';
import BlogPosts from '../Builder/_components/BlogPosts';
import BuyBackSection from '../Builder/_components/BuyBackSection';
import CollectionPreview from '../Builder/_components/CollectionPreview';
import HowDoesItWorksSection from '../Builder/_components/HowDoesItWorksSection';
import MainHeader from '../Builder/_components/MainHeader';
import TopBrands from '../Builder/_components/TopBrands';
import TopCategories from '../Builder/_components/TopCategories';
import Trustpilot from '../Builder/_components/Trustpilot';
import WhyBarooders from '../Builder/_components/WhyBarooders';

const dict = getDictionary('fr');

export type PropsType = {
  header: React.ComponentProps<typeof MainHeader>;
};

const FETCH_HOMEPAGE_CONFIG = gql`
  query {
    webHome {
      data {
        attributes {
          mainBanner {
            link
            image {
              data {
                attributes {
                  url
                }
              }
            }
          }
          bannerDesktop {
            link
            image {
              data {
                attributes {
                  url
                }
              }
            }
          }
          bannerMobile {
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
`;

type HomePageConfig = {
  webHome: {
    data: {
      attributes: {
        mainBanner: {
          link: string;
          image: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        };
        bannerDesktop: {
          link: string;
          image: {
            data: {
              attributes: {
                url: string;
              };
            };
          };
        }[];
        bannerMobile: {
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
};

export const getData = async (): Promise<PropsType> => {
  const content = await fetchStrapiGraphQL<HomePageConfig, unknown>(
    FETCH_HOMEPAGE_CONFIG,
    {},
  );

  const headerConfig = {
    mainSlide: {
      link: content.webHome.data.attributes.mainBanner.link,
      image:
        content.webHome.data.attributes.mainBanner.image.data.attributes.url,
    },
    desktopSlides: content.webHome.data.attributes.bannerDesktop.map(
      (slide) => ({
        link: slide.link,
        image: slide.image.data.attributes.url,
      }),
    ),
    mobileSlides: content.webHome.data.attributes.bannerMobile.map((slide) => ({
      link: slide.link,
      image: slide.image.data.attributes.url,
    })),
  };
  return { header: headerConfig };
};

const HomePage: React.FC<PropsType> = ({ header }) => {
  return (
    <>
      <div className="z-10">
        <SnowFall />
      </div>
      <MainHeader
        mainSlide={header.mainSlide}
        desktopSlides={header.desktopSlides}
        mobileSlides={header.mobileSlides}
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
      <BlockContent
        title={dict.homepage.ambassadors.title}
        subtitle={dict.homepage.ambassadors.subtitle}
      >
        <Ambassadors />
      </BlockContent>
      <div className="flex justify-center">
        <div className="mt-10 h-[1px] w-[150px] bg-black" />
      </div>
      <BlockContent>
        <Trustpilot />
      </BlockContent>
      <BlockContent>
        <HowDoesItWorksSection />
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
