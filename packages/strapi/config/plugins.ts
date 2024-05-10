import envConfig from '../config/variables';

export default () => ({
  // @strapi-provider-upload-aws-s3
  upload: {
    config: {
      provider: 'aws-s3',
      providerOptions: {
        accessKeyId: envConfig.aws.accessKeyId,
        secretAccessKey: envConfig.aws.accessSecret,
        region: envConfig.aws.region,
        params: {
          Bucket: envConfig.aws.bucket,
        },
      },
      actionOptions: {
        upload: {},
        uploadStream: {},
        delete: {},
      },
    },
  },
  // strapi-graphql
  graphql: {
    config: {
      apolloServer: {
        introspection: true,
      },
    },
  },
  // strapi-plugin-menus
  menus: {
    config: {
      layouts: {
        // This is the menu item edit panel.
        menuItem: {
          // This is the "link" tab in the menu item edit panel.
          link: [
            {
              input: {
                label: 'Item type',
                name: 'item_type',
                type: 'select',
                options: [
                  {
                    label: 'Link',
                    value: 'link',
                  },
                  {
                    label: 'Card',
                    value: 'card',
                  },
                ],
                required: true,
              },
              grid: {
                col: 12,
              },
            },
            {
              input: {
                label: 'Pin item to parent menu panel',
                name: 'is_pinned',
                type: 'bool',
              },
              grid: {
                col: 12,
              },
            },
            {
              input: {
                label: 'Show in sport section',
                name: 'is_sport_section',
                type: 'bool',
              },
              grid: {
                col: 12,
              },
            },
            {
              input: {
                label: 'Order in mobile header (0 is not shown)',
                name: 'mobile_header_order',
                type: 'number',
              },
              grid: {
                col: 12,
              },
            },
            {
              input: {
                label: 'Hide item in menu',
                name: 'is_hidden_in_menu',
                type: 'bool',
              },
              grid: {
                col: 12,
              },
            },
            {
              input: {
                label: 'Collection Id',
                name: 'collection_id',
                type: 'string',
              },
              grid: {
                col: 12,
              },
            },
          ],
          card: [
            {
              input: {
                label: 'Card image',
                name: 'card_image',
                type: 'media',
              },
              grid: {
                col: 12,
              },
            },
            {
              input: {
                label: 'Card image for mobile menu',
                name: 'card_image_mobile',
                type: 'media',
              },
              grid: {
                col: 12,
              },
            },
            {
              input: {
                label: 'Button text',
                name: 'button_text',
                type: 'string',
                description:
                  'Leave empty if you do not want button to be displayed.',
              },
              grid: {
                col: 12,
              },
            },
            {
              input: {
                label: 'Show card in nested items panels',
                name: 'is_default',
                type: 'bool',
                description: 'Show card to every nested menu item',
              },
              grid: {
                col: 12,
              },
            },
          ],
        },
      },
    },
  },
  // strapi-plugin-rest-cache
  'rest-cache': {
    config: {
      provider: {
        name: 'memory',
        getTimeout: 500,
        options: {
          max: 32767,
          maxAge: 3600,
          // Update to the current time whenever it is retrieved from
          // cache, causing it to not expire
          updateAgeOnGet: false,
        },
      },

      strategy: {
        // Ref: https://strapi-community.github.io/strapi-plugin-rest-cache/documentation/configuration-reference.html#enableetag
        enableEtag: true,
        debug: true,
        enableXCacheHeaders: true,
        contentTypes: [
          'api::mobile-app-home.mobile-app-home',
          'api::pim-dynamic-attribute.pim-dynamic-attribute',
          'api::blog-article.blog-article',
          'api::blog-tag.blog-tag',
          // selling-form-config
          {
            contentType: 'api::pim-product-type.pim-product-type',
            routes: /* @type {CacheRouteConfig[]} */ [
              {
                path: '/api/selling-form-config',
              },
            ],
          },
          // strapi-plugin-menus
          {
            contentType: 'plugin::menus.menu',
            routes: /* @type {CacheRouteConfig[]} */ [
              {
                path: '/api/menus/:id+',
              },
            ],
          },
          {
            contentType: 'plugin::menus.menu-item',
            routes: /* @type {CacheRouteConfig[]} */ [
              {
                path: '/api/menus/:id+',
              },
            ],
          },
        ],
      },
    },
  },
});
