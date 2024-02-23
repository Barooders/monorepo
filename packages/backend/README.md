# Barooders Backend

A software to handle all Barooders backend logic.

![image](https://user-images.githubusercontent.com/10167015/212770522-dffbb2ff-1438-467e-8ab6-c1c1fb7487f0.png)
[Edit on Excalidraw](https://excalidraw.com/#json=1xpuEsAcaIzBH_KXNaWNd,3vMzTbsMs6CdVWA2jzH7kA)

## Installation

To install and start all dependencies, run the following:

```
cp .env.example .env
yarn
docker-compose up -d
```

## Developing

To update Hasura metadata:

```
yarn hasura:start
```

To run the API:

```
yarn start:dev
```

## Migrations

To create a new migration, modify the schema.prisma file, then run:

```
yarn prisma migrate dev --name $A_SHORT_NAME_TO_EXPLAIN_MODIFICATION
```

## Deployment process

![image](https://user-images.githubusercontent.com/10167015/212777860-c2661a0d-83bb-46af-94e4-b8fda8641205.png)
[Edit on Excalidraw](https://excalidraw.com/#json=UUAlD-BI04XN3YAjhKykP,yru6Eu8Oo3BqvqkCQeOLrQ)

On merge on `staging`:

- Hasura metadata will be deployed to [Hasura Cloud](https://cloud.hasura.io/project/ab0ec934-830b-47f9-a27d-20b37730d70d/git-deployment)
- API and Prisma will be deployed to [Heroku](https://dashboard.heroku.com/apps/barooders-backend-staging/activity)
- Shopify Custom staging App extensions will be deployed to Shopify CDN ([App extensions dashboard](https://partners.shopify.com/2180844/apps/30927290369/extensions)). You will still need to create a version manually of the extensions if you want the change to be live to merchants (e.g. [Commission extension](https://partners.shopify.com/2180844/apps/30927290369/extensions/checkout_ui_extension/21560950785)).
- Commission extension (Checkout UI extension) also need to be configured in [Shopify theme editor](https://barooders-stagging.myshopify.com/admin/settings/checkout/editor).

On merge on `main`:

- Hasura metadata will be deployed to [Hasura Cloud](https://cloud.hasura.io/project/d81a0d9c-51cc-4372-bc8a-aee4f1a7aa1d/git-deployment)
- API and Prisma will be deployed to [Heroku](https://dashboard.heroku.com/apps/barooders-backend/activity)
- Shopify Custom App extensions will be deployed to Shopify CDN ([App extensions dashboard](https://partners.shopify.com/2180844/apps/30946361345/extensions)). You will still need to create a version manually of the extensions if you want the change to be live to merchants.
- Commission extension (Checkout UI extension) also need to be configured in [Shopify theme editor](https://barooders.myshopify.com/admin/settings/checkout/editor).

More details on extension deploy: https://www.loom.com/share/4a1db57911dc41b6bb5d1295ddcb25c9

# Troubleshooting

- When encountering a `Cannot decode input: Data.Text.Internal.Encoding.decodeUtf8: Invalid UTF-8 stream`, check that you are passing the shopify id as a `gid://shopify/Collection/***` format
