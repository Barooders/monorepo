import {
  CollectionApiType,
  CollectionCreateInputType,
  CollectionUpdateInputType,
  NewCollectionType,
} from './types';

const collectionPattern = /gid:\/\/shopify\/Collection\/(\d+)/g;

const replaceCollectionIds = (
  metafieldValue: string,
  mapping: Record<string, string>,
): string => {
  const matchedIds = [...metafieldValue.matchAll(collectionPattern)].map(
    (matched) => matched[0],
  );

  return matchedIds.reduce((replacedValue, idToReplace) => {
    const stagingCollectionId = mapping[idToReplace];
    if (stagingCollectionId) {
      return replacedValue.replace(idToReplace, stagingCollectionId);
    }
    return replacedValue
      .replace(`\"${idToReplace}\",`, '')
      .replace(`,\"${idToReplace}\"`, '')
      .replace(`\"${idToReplace}\"`, '');
  }, metafieldValue);
};

export const mapCollectionToCreateInput = (
  collection: CollectionApiType,
): CollectionCreateInputType => {
  const collectionInput: CollectionCreateInputType = {
    handle: collection.handle,
    descriptionHtml: collection.descriptionHtml,
    image: collection.image,
    seo: collection.seo,
    title: collection.title,
  };

  if (collection.ruleSet) {
    collectionInput.ruleSet = {
      appliedDisjunctively: collection.ruleSet.appliedDisjunctively,
      rules: collection.ruleSet.rules.map((rule) => ({
        column: rule.column,
        condition: rule.condition,
        relation: rule.relation,
        conditionObjectId: rule.conditionObject?.metafieldDefinition?.id,
      })),
    };
  }

  return collectionInput;
};

export const mapCollectionToUpdateInput = (
  collection: NewCollectionType,
  collectionIdMapping: Record<string, string>,
): CollectionUpdateInputType => {
  const collectionInput: CollectionUpdateInputType = {
    id: collection.id,
    metafields: collection.metafields.nodes.map((metafield) => ({
      ...metafield,
      value: replaceCollectionIds(metafield.value, collectionIdMapping),
    })),
  };

  return collectionInput;
};
