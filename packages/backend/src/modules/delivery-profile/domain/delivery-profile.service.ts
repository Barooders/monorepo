import { shopifyConfig } from '@config/shopify.config';
import { Injectable, Logger } from '@nestjs/common';
import {
  DeliveryConditionField,
  DeliveryConditionOperator,
  DeliveryMethodDefinition,
  DeliveryRateDefinition,
  ProductVariant,
  Weight,
} from '@quasarwork/shopify-api-types/api/admin/2023-01';
import { RequestReturn } from '@quasarwork/shopify-api-types/utils/shopify-api';
import { composeGid } from '@shopify/admin-graphql-api-utilities';
import { uniqBy } from 'lodash';

// eslint-disable-next-line import/no-restricted-paths
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';

@Injectable()
export class DeliveryProfileService {
  private readonly logger: Logger = new Logger(DeliveryProfileService.name);

  constructor(private shopifyApiBySession: ShopifyApiBySession) {}

  private sortMethodDefinitionsByPrice(
    deliveryMethodDefinitions: DeliveryMethodDefinition[],
  ): DeliveryMethodDefinition[] {
    return deliveryMethodDefinitions.sort((a, b) => {
      const aPrice = (a.rateProvider as DeliveryRateDefinition)?.price?.amount;
      const bPrice = (b.rateProvider as DeliveryRateDefinition)?.price?.amount;

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!aPrice || !bPrice) return 0;

      return aPrice - bPrice;
    });
  }

  private filterCheapestMethodDefinitionsWithSameName(
    deliveryMethodDefinitions: DeliveryMethodDefinition[],
  ): DeliveryMethodDefinition[] {
    const sortedDeliveryMethodDefinitions = this.sortMethodDefinitionsByPrice(
      deliveryMethodDefinitions,
    );

    return uniqBy(sortedDeliveryMethodDefinitions, 'name');
  }

  /**
   * It removes method definitions that do not meet the weight criteria.
   */
  private filterMethodDefinitionsByWeightCriteria(
    productVariant: ProductVariant,
    deliveryMethodDefinitions: DeliveryMethodDefinition[],
  ): DeliveryMethodDefinition[] {
    return deliveryMethodDefinitions.filter((methodDefinition) => {
      const weightCriterias = methodDefinition.methodConditions.filter(
        (condition) => {
          return condition.field === DeliveryConditionField.TotalWeight;
        },
      );

      // If there is no criterias related to weight, the method definition is eligible.
      if (weightCriterias.length === 0) return true;

      // The method is eligible if every weight criteria is met.
      return weightCriterias.every((criteria) => {
        switch (criteria.operator) {
          case DeliveryConditionOperator.GreaterThanOrEqualTo:
            return (
              (productVariant.weight ?? 0) >=
              (criteria.conditionCriteria as Weight).value
            );
          case DeliveryConditionOperator.LessThanOrEqualTo:
            return (
              (productVariant.weight ?? 0) <=
              (criteria.conditionCriteria as Weight).value
            );
          default:
            throw new Error(`Unknow criteria operator: ${criteria.operator}`);
        }
      });
    });
  }

  private async getProductVariant(variantShopifyId: number) {
    const variables = {
      id: composeGid('ProductVariant', variantShopifyId),
    };

    const response: RequestReturn<{
      productVariant: ProductVariant & {
        product: {
          acceptsHandDelivery: { value: string } | null;
          handDeliveryPostalCode: { value: string } | null;
        };
      };
    }> = await (
      await this.shopifyApiBySession.getGraphqlClient()
    ).query({
      data: {
        query: `
        query productVariant($id: ID!) {
          productVariant(id: $id){
            weight
            product {
              acceptsHandDelivery: metafield(key: "hand_delivery", namespace: "barooders") {
                  value
                }
              handDeliveryPostalCode: metafield(key: "hand_delivery_postal_code", namespace: "barooders") {
                  value
                }
            }
          }
        }
          `,
        variables,
      },
    });

    const productVariant = response.body.data.productVariant;

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!productVariant) throw new Error('Product variant not found');

    return productVariant;
  }

  private async getDeliveryProfile(
    variantShopifyId: number,
    afterCursor?: string | null,
  ): Promise<DeliveryMethodDefinition[]> {
    const variables = {
      id: composeGid('ProductVariant', variantShopifyId),
      after: afterCursor ?? null,
    };

    const response: RequestReturn<{
      productVariant: ProductVariant;
    }> = await (
      await this.shopifyApiBySession.getGraphqlClient()
    ).query({
      data: {
        query: `
        query productVariant($id: ID!, $after: String) {
          productVariant(id: $id){
            deliveryProfile {
              profileLocationGroups {
                locationGroupZones(first: 1, after: $after) {
                  pageInfo {
                    hasNextPage
                    startCursor
                  }
                  nodes {
                    zone { name }
                    methodDefinitions(first: 200, eligible: true) {
                      nodes {
                        id
                        rateProvider {
                          ... on DeliveryRateDefinition {
                            id
                            price {
                              amount
                            }
                          }
                          __typename
                        }
                        name
                        methodConditions {
                          field
                          id
                          operator
                          conditionCriteria {
                            ... on Weight {
                              value
                            }
                            __typename
                          }
                        }
                        description
                        active
                      }
                    }
                  }
                }
              }
            }
          }
        }
          `,
        variables,
      },
    });

    const productVariant = response.body.data.productVariant;
    const deliveryProfile = productVariant?.deliveryProfile;

    if (!deliveryProfile) throw new Error('Delivery profile not found');

    const locationGroupZones =
      deliveryProfile.profileLocationGroups[0].locationGroupZones;
    const frZone = locationGroupZones.nodes.find(({ zone }) =>
      zone.name.toLowerCase().includes('france'),
    );

    if (!!frZone) return frZone.methodDefinitions.nodes;

    if (locationGroupZones.pageInfo.hasNextPage) {
      return await this.getDeliveryProfile(
        variantShopifyId,
        locationGroupZones.pageInfo.startCursor,
      );
    }

    return locationGroupZones.nodes[0].methodDefinitions.nodes;
  }

  async fetchEligibleProductVariantDeliveryProfile(
    variantShopifyId: number,
  ): Promise<{ methodDefinitions: DeliveryMethodDefinition[] } | undefined> {
    try {
      const [productVariant, matchedMethodDefinitions] = await Promise.all([
        this.getProductVariant(variantShopifyId),
        this.getDeliveryProfile(variantShopifyId),
      ]);

      const acceptsHandDelivery =
        productVariant.product.acceptsHandDelivery?.value === 'true';
      const handDeliveryPostalCode =
        productVariant.product.handDeliveryPostalCode?.value;

      let methodDefinitions = this.filterMethodDefinitionsByWeightCriteria(
        productVariant,
        matchedMethodDefinitions,
      );

      methodDefinitions =
        this.filterCheapestMethodDefinitionsWithSameName(methodDefinitions);

      methodDefinitions = methodDefinitions.map((methodDefinition) => {
        return {
          ...methodDefinition,
          name: `${methodDefinition.name}${
            shopifyConfig.handDeliveryMethodName === methodDefinition.name &&
            acceptsHandDelivery &&
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            handDeliveryPostalCode
              ? ` (${handDeliveryPostalCode})`
              : ''
          }`,
        };
      });

      return { methodDefinitions: methodDefinitions };
    } catch (err) {
      this.logger.error((err as Error)?.message, err);

      return undefined;
    }
  }
}
