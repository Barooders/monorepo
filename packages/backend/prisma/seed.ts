import { PrismaClient } from '@libs/domain/prisma.main.client';

export const DEFAULT_USER = 'a2c381be-84ec-4b6c-b819-410988bd3ae8';

const prisma = new PrismaClient();
async function main() {
  await prisma.customer.upsert({
    where: { shopifyId: 7141905695055 },
    update: {},
    create: {
      shopifyId: 7141905695055,
      profilePictureShopifyCdnUrl:
        'https://cdn.shopify.com/s/files/1/0576/4340/1365/files/pdp_mavic.jpg?v=1658763951',
      coverPictureShopifyCdnUrl:
        'https://cdn.shopify.com/s/files/1/0576/4340/1365/files/Banner_mavic.jpg?v=1658762236',
      sellerName: 'Default local user',
      isPro: true,
      description: `Somme description`,
      user: {
        create: {
          locale: 'FR',
          email: 'somefake@email.fr',
          id: DEFAULT_USER,
          display_name: 'Default local user',
          email_verified: true,
          roles: {
            create: {
              role: 'USER',
            },
          },
        },
      },
    },
  });

  await prisma.shopifySession.upsert({
    where: { id: 'offline_barooders-stagging.myshopify.com' },
    update: {},
    create: {
      id: 'offline_barooders-stagging.myshopify.com',
      shop: 'barooders-stagging.myshopify.com',
      state: '402632284539482',
      isOnline: false,
      scope: '402632284539482',
      expires: null,
      accessToken: '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',
      onlineAccessInfo: null,
    },
  });
}
main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
