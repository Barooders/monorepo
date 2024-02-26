import { Condition } from '@libs/domain/prisma.store.client';
import { jsonStringify } from '@libs/helpers/json';
import {
  typesenseVariantClient,
  TypesenseVariantDocument,
} from '@libs/infrastructure/typesense/typesense.base.client';
import { SearchRepository } from '@modules/search-alert/domain/ports/search-repository';
import { Logger } from '@nestjs/common';
import { head } from 'lodash';
import { SearchResponseHit } from 'typesense/lib/Typesense/Documents';

export class TypesenseRepository implements SearchRepository {
  private readonly logger = new Logger(TypesenseRepository.name);

  async getSavedSearchResults(
    query: string,
    facetFilters: { facetName: string; value: string }[],
    numericFilters: { facetName: string; value: string; operator: string }[],
    since: Date,
  ): Promise<{
    nbHits: number;
    hits: {
      imageUrl: string;
      brand: string;
      handle: string;
      characteristics: string;
      price: string;
      compareAtPrice: string;
      discount: string;
    }[];
  }> {
    const queryOptions = {
      facetFilters: facetFilters.map(
        (facetFilter) => `${facetFilter.facetName}:=${facetFilter.value}`,
      ),
      numericFilters: [
        `publishedat_timestamp:>${since.getTime()}`,
        `inventory_quantity:>0`,
        ...numericFilters.map(
          (numericFilter) =>
            `${numericFilter.facetName}:${numericFilter.operator}${numericFilter.value}`,
        ),
      ],
    };

    this.logger.debug(
      `Searching with options ${jsonStringify(queryOptions, 2)}`,
    );

    const { hits, found: nbHits } = await typesenseVariantClient
      .documents()
      .search({
        q: query,
        preset: 'searchable_product_attributes',
        filter_by: [
          ...queryOptions.facetFilters,
          ...queryOptions.numericFilters,
        ].join('&&'),
      });

    const results =
      hits ?? ([] as SearchResponseHit<TypesenseVariantDocument>[]);

    return {
      nbHits,
      hits: results
        .filter((hit) => hit.document.product_image !== undefined)
        .map((hit) => ({
          imageUrl: hit.document.product_image ?? '',
          handle: hit.document.handle,
          title: hit.document.title,
          brand: head(hit.document.array_tags.marque) ?? '',
          price: String(hit.document.price),
          compareAtPrice: String(hit.document.compare_at_price),
          discount: String(
            ((hit.document.compare_at_price - hit.document.price) /
              hit.document.compare_at_price) *
              100,
          ),
          characteristics: [
            head(hit.document.array_tags.modele),
            head(hit.document.array_tags.année),
            hit.document.condition === Condition.AS_NEW
              ? 'Neuf'
              : hit.document.condition === Condition.REFURBISHED_AS_NEW
                ? 'Comme neuf'
                : hit.document.condition === Condition.VERY_GOOD
                  ? 'Très bon état'
                  : 'Bon état',
          ]
            .filter((value) => !!value)
            .join('・'),
        })),
    };
  }
}
