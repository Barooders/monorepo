import { fetchStrapiGraphQL } from '@/clients/strapi';
import { gql } from '@apollo/client'; // eslint-disable-line no-restricted-imports
import { PropsType } from '.';

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

export const getHomepageConfig = async (): Promise<PropsType> => {
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
