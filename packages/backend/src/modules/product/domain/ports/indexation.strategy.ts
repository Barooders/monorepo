import { SalesChannelName } from '@libs/domain/prisma.main.client';
import {
  B2BVariantToIndex,
  PublicVariantToIndex,
} from './variant-to-index.type';

export type VariantToIndexWithTarget =
  | {
      target: typeof SalesChannelName.PUBLIC;
      data: PublicVariantToIndex;
    }
  | {
      target: typeof SalesChannelName.B2B;
      data: B2BVariantToIndex;
    };

export interface IndexationStrategy {
  indexVariant(variant: VariantToIndexWithTarget['data']): Promise<void>;
  pruneVariants(
    existingVariantIds: string[],
    shouldDeleteDocuments?: boolean,
  ): Promise<void>;
}
