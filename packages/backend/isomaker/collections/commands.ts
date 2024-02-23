/* eslint-disable no-console */
import { EnvType, publicationChannels } from '../config';
import {
  mapCollectionToCreateInput,
  mapCollectionToUpdateInput,
} from './mappers';
import {
  checkCollectionExists,
  checkCollectionExistsInDB,
  createCollection,
  createCollectionInDB,
  deleteCollection,
  getAllCollectionHandles,
  getCollectionDetails,
  getPublications,
  publishCollection,
  updateCollection,
} from './repository';
import { NewCollectionType } from './types';

export const syncCollectionToStaging = async () => {
  console.log('Starting to sync collections');
  const prodCollectionHandles = await getAllCollectionHandles('production');

  const collectionEntries = prodCollectionHandles
    .map(({ handle }) => handle)
    .entries();

  console.log(
    `Starting to update ${prodCollectionHandles.length} collections on staging`,
  );

  const newCollections: NewCollectionType[] = [];

  for (const [index, collectionHandle] of collectionEntries) {
    try {
      console.log(
        `Syncing ${collectionHandle} (${index + 1}/${
          prodCollectionHandles.length
        })`,
      );

      const existingCollection = await checkCollectionExists(collectionHandle);

      if (existingCollection?.id) {
        void deleteCollection(existingCollection?.id);
      }

      const collection = await getCollectionDetails(collectionHandle);

      const newCollection = await createCollection(
        mapCollectionToCreateInput(collection),
      );

      const createdMetafields = newCollection.metafields.nodes;
      const prodMetafields = collection.metafields.edges;

      const metafieldsToUpdate = createdMetafields.map((metafield) => ({
        id: metafield.id,
        value:
          prodMetafields.find(
            (prodMetafield) =>
              prodMetafield.node.namespace === metafield.namespace &&
              prodMetafield.node.key === metafield.key,
          )?.node.value ?? '',
      }));

      const metafieldsToCreate = prodMetafields
        .map(({ node }) => node)
        .filter(
          (prodMetafield) =>
            !createdMetafields.some(
              (createdMetafield) =>
                createdMetafield.namespace === prodMetafield.namespace &&
                createdMetafield.key === prodMetafield.key,
            ),
        );

      newCollections.push({
        ...newCollection,
        metafields: {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          nodes: [...metafieldsToUpdate, ...metafieldsToCreate],
        },
      });
    } catch (e) {
      console.log(`Failed for ${collectionHandle}, continuing...`);
    }
  }

  const stagingCollectionHandles = await getAllCollectionHandles('staging');

  const mapProdIdToStaging = prodCollectionHandles.reduce(
    (mapping, prodEntry) => ({
      ...mapping,
      [prodEntry.id]: stagingCollectionHandles.find(
        (stagingEntry) => stagingEntry.handle === prodEntry.handle,
      )?.id,
    }),
    {},
  );

  const publicationIds = (await getPublications())
    .filter(({ name }) => publicationChannels.includes(name))
    .map(({ id }) => id);

  for (const [index, collection] of newCollections.entries()) {
    try {
      console.log(
        `Creating metafield for ${collection.handle} (${index + 1}/${
          stagingCollectionHandles.length
        })`,
      );
      await updateCollection(
        mapCollectionToUpdateInput(collection, mapProdIdToStaging),
      );
      for (const publicationId of publicationIds) {
        await publishCollection(collection.id, publicationId);
      }
      await createCollectionInDB({
        ...collection,
        metafields: collection.metafields.nodes,
      });
    } catch (e) {
      console.log(
        `Metafield creation failed for ${collection.handle}, continuing...`,
      );
    }
  }

  console.log('All collections synced!');
};

export const syncCollectionToDB = async (envName: EnvType) => {
  console.log('Starting to sync collections');
  const prodCollectionHandles = await getAllCollectionHandles(envName);

  const collectionEntries = prodCollectionHandles.entries();

  console.log(
    `Starting to insert ${prodCollectionHandles.length} collections in DB`,
  );

  for (const [index, collectionHandle] of collectionEntries) {
    if (await checkCollectionExistsInDB(collectionHandle.id)) continue;
    try {
      console.log(
        `Syncing ${collectionHandle.handle} (${index + 1}/${
          prodCollectionHandles.length
        })`,
      );

      const collection = await getCollectionDetails(
        collectionHandle.handle,
        envName,
      );

      await createCollectionInDB({
        ...collection,
        imageSrc: collection.image?.src,
        seoDescription: collection.seo?.description,
        seoTitle: collection.seo?.title,
        metafields: collection.metafields.edges.map(({ node }) => node),
      });
    } catch (e) {
      console.log(`Failed for ${collectionHandle.handle}, continuing...`);
      console.error(e);
    }
  }

  console.log('All collections synced!');
};
