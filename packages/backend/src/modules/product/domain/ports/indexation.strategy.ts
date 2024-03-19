export interface IndexationStrategy {
  pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void>;
}
