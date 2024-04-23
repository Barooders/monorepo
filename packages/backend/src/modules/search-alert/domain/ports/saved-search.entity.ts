import { SavedSearchType } from '@libs/domain/prisma.main.client';

export type FacetFilter = {
  facetName: string;
  value: string;
  label: string;
};
export type NumericFilter = {
  facetName: string;
  value: string;
  operator: string;
};

export type SavedSearchEntity = {
  name: string;
  type: SavedSearchType;
  resultsUrl: string;
  facetFilters: FacetFilter[];
  numericFilters: NumericFilter[];
  shouldTriggerAlerts: boolean;
  collectionId?: string;
  query?: string;
};
