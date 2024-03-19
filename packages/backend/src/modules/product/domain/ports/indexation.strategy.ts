import { VariantToIndex } from './variant-to-index.type';

export interface IndexationStrategy {
  indexVariant(variant: VariantToIndex): Promise<void>;
  pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void>;
}
