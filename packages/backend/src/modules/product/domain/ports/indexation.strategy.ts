import { VariantToIndexWithTarget } from '../indexation.service';

export interface IndexationStrategy {
  indexVariant(variant: VariantToIndexWithTarget['data']): Promise<void>;
  pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void>;
}
