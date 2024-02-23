export type CollectionBaseType = {
  id?: string;
  title: string;
  handle: string;
  descriptionHtml: string;
  seo: {
    description: string;
    title: string;
  };
  image: {
    altText: string;
    src: string;
  };
};

export type CollectionApiType = CollectionBaseType & {
  ruleSet?: {
    appliedDisjunctively: boolean;
    rules: {
      column: string;
      condition: string;
      relation: string;
      conditionObject: {
        metafieldDefinition: { id: string };
      };
    }[];
  };
  id: string;
  metafields: {
    edges: {
      node: MetafieldType;
    }[];
  };
};

export type NewCollectionType = {
  id: string;
  handle: string;
  metafields: {
    nodes: (
      | { id: string; key: string; namespace: string; value: string }
      | MetafieldType
    )[];
  };
};

export type CollectionCreateInputType = CollectionBaseType & {
  ruleSet?: {
    appliedDisjunctively: boolean;
    rules: {
      column: string;
      condition: string;
      relation: string;
      conditionObjectId: string;
    }[];
  };
};

export type CollectionUpdateInputType = {
  id?: string;
  metafields: (
    | {
        id: string;
        value: string;
      }
    | MetafieldType
  )[];
};

export type MetafieldType = {
  id?: string;
  namespace: string;
  key: string;
  value: string;
  type?: string;
};
