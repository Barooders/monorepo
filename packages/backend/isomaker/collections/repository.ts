import { CollectionType } from '@libs/domain/prisma.main.client';
import prisma from 'isomaker/utils/prisma';
import { fromStorefrontId } from 'isomaker/utils/shopifyId';
import { EnvType } from '../config';
import { graphQLClient } from '../utils/graphqlClient';
import {
  CollectionApiType,
  CollectionCreateInputType,
  CollectionUpdateInputType,
  NewCollectionType,
} from './types';

export const createCollection = async (input: CollectionCreateInputType) => {
  const result = await graphQLClient<{
    collectionCreate: {
      collection: NewCollectionType;
    };
  }>('staging', {
    query: `
  mutation collectionCreate($input: CollectionInput!) {
    collectionCreate(input: $input) {
      collection {
        id
        handle
        metafields(first: 250) {
          nodes {
            key
            namespace
            id
          }
        }
      }
      userErrors {
        message
        field
      }
    }
  }
`,
    variables: { input },
  });

  return result.data.collectionCreate.collection;
};

export const updateCollection = async (input: CollectionUpdateInputType) => {
  const result = await graphQLClient<{
    collectionUpdate: { collection: { id: string } };
  }>('staging', {
    query: `
  mutation collectionUpdate($input: CollectionInput!) {
    collectionUpdate(input: $input) {
      collection {
        id
      }
      userErrors {
        message
        field
      }
    }
  }
`,
    variables: { input },
  });

  return result.data.collectionUpdate.collection.id;
};

export const deleteCollection = async (collectionId: string) => {
  await graphQLClient<{ data: { deletedCollectionId: string } }>('staging', {
    query: `
  mutation collectionDelete($input: CollectionDeleteInput!) {
    collectionDelete(input: $input) {
      deletedCollectionId
    }
  }
`,
    variables: { input: { id: collectionId } },
  });
};

export const getAllCollectionHandles = async (env: EnvType) => {
  const fetchPage = (startCursor: string | null) =>
    graphQLClient<{
      collections: {
        pageInfo: { hasNextPage: boolean; endCursor: string };
        nodes: { handle: string; id: string }[];
      };
    }>(env, {
      query: `query fetchCollectionHandles ($startCursor: String) {collections(first: 200, after: $startCursor) {
				pageInfo {
					endCursor
					hasNextPage
				}
        nodes {
          handle
          id
        }
    }
  }
`,
      variables: { startCursor },
    });

  let collectionHandles: { handle: string; id: string }[] = [];
  let startCursor: string | null = null;
  let currentPage = null;

  do {
    currentPage = await fetchPage(startCursor);
    collectionHandles = collectionHandles.concat(
      currentPage.data.collections.nodes,
    );
    startCursor = currentPage.data.collections.pageInfo.endCursor;
  } while (currentPage.data.collections.pageInfo.hasNextPage);

  return collectionHandles;
};

export const getCollectionDetails = async (
  handle: string,
  envName: EnvType = 'production',
) => {
  const result = await graphQLClient<{
    collectionByHandle: CollectionApiType;
  }>(envName, {
    query: `
query getCollectionDetails($handle: String!) {
  collectionByHandle(handle: $handle) {
    id
    title
    handle
    descriptionHtml
    metafields(first: 10) {
      edges {
        node {
          type
          namespace
          key
          value
        }
      }
    }
    ruleSet {
      appliedDisjunctively
      rules {
        column
        condition
        relation
        conditionObject {
          ... on CollectionRuleMetafieldCondition {
            metafieldDefinition {
              id
            }
          }
        }
      }
    }
    seo {
      description
      title
    }
    title
    image {
      altText
      src
    }
  }
}
`,
    variables: { handle },
  });

  return result.data.collectionByHandle;
};

export const checkCollectionExists = async (handle: string) => {
  const result = await graphQLClient<{ collectionByHandle: { id: string } }>(
    'staging',
    {
      query: `
              query getCollectionDetails($handle: String!) {
                collectionByHandle(handle: $handle) {
                  id
                }
              }`,
      variables: { handle },
    },
  );

  return result.data.collectionByHandle;
};

export const publishCollection = async (
  collectionId: string,
  publicationId: string,
) => {
  const result = await graphQLClient<{
    collectionPublish: { collection: { id: string }[] };
  }>('staging', {
    query: `
        mutation collectionPublish($input: CollectionPublishInput!) {
          collectionPublish(input: $input) {
            collection {
              id
            }
            userErrors {
              field
              message
            }
          }
        }
    `,
    variables: {
      input: {
        collectionPublications: [
          {
            publicationId,
          },
        ],
        id: collectionId,
      },
    },
  });

  return result.data.collectionPublish.collection;
};

export const getPublications = async () => {
  const result = await graphQLClient<{
    publications: { nodes: { id: string; name: string }[] };
  }>('staging', {
    query: `
    query getPublications {
      publications(first: 100) {
        nodes {
          id
          name
        }
      }
    }
    `,
  });

  return result.data.publications.nodes;
};

const findMetafield = (
  collection: {
    id: string;
    handle: string;
    metafields: { key: string; namespace: string; value: string }[];
  },
  namespace: string,
  key: string,
) => {
  return (
    collection.metafields.find(
      (metafield) => metafield.namespace === namespace && metafield.key === key,
    )?.value ?? null
  );
};

export const checkCollectionExistsInDB = async (collectionId: string) => {
  const simpleId = fromStorefrontId(collectionId, 'Collection');
  const existingCollection = await prisma.collection.findUnique({
    where: {
      shopifyId: simpleId,
    },
  });

  return !!existingCollection;
};

export const createCollectionInDB = async (collection: {
  id: string;
  handle: string;
  title?: string;
  imageSrc?: string;
  descriptionHtml?: string;
  seoDescription?: string;
  seoTitle?: string;
  metafields: { key: string; namespace: string; value: string }[];
}) => {
  if (await checkCollectionExistsInDB(collection.id)) return;

  const parentCollectionMetafield = findMetafield(
    collection,
    'barooders',
    'parent_collections',
  );
  const parentCollectionIds = !!parentCollectionMetafield
    ? JSON.parse(parentCollectionMetafield)
    : null;
  const parentCollectionId = Array.isArray(parentCollectionIds)
    ? fromStorefrontId(
        parentCollectionIds[parentCollectionIds.length - 1],
        'Collection',
      )
    : null;

  const collectionShopifyType = findMetafield(collection, 'barooders', 'type');

  const collectionType = collectionShopifyType
    ? CollectionType[collectionShopifyType as keyof typeof CollectionType]
    : null;

  await prisma.collection.create({
    data: {
      shopifyId: fromStorefrontId(collection.id, 'Collection'),
      parentCollectionId,
      shortName: findMetafield(collection, 'custom', 'name_alias'),
      type: collectionType,
      handle: collection.handle,
      seoDescription: collection.seoDescription,
      seoTitle: collection.seoTitle,
      description: collection.descriptionHtml,
      featuredImageSrc: collection.imageSrc,
      title: collection.title,
    },
  });
};
