import { toCents } from '@libs/helpers/currency';
import { LoggerService } from '@libs/infrastructure/logging/logger.service';
import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import {
  RequirementType,
  ShippingOptionPriceType,
  ShippingProfileType,
} from '@medusajs/medusa';
import Medusa from '@medusajs/medusa-js';
import { Logger } from '@nestjs/common';
import {
  DeliveryConditionField,
  DeliveryConditionOperator,
  DeliveryProfile,
  DeliveryRateDefinition,
  MoneyV2,
  Weight,
} from '@quasarwork/shopify-api-types/api/admin/2023-01';
import { RequestReturn } from '@shopify/shopify-api';
import { first } from 'lodash';
import { Command, Console } from 'nestjs-console';
import { shippingConditions } from './data/shipping-conditions';

const MEDUSA_BACKEND_URL = 'https://store-staging.barooders.com';

enum WeidhtRequirementType {
  MIN_WEIGHT = 'min_weight',
  MAX_WEIGHT = 'max_weight',
}

@Console()
export class SyncShippingsInMedusaCLI {
  private readonly logger: Logger = new Logger(SyncShippingsInMedusaCLI.name);
  private medusaClient = new Medusa({
    baseUrl: MEDUSA_BACKEND_URL,
    maxRetries: 3,
    apiKey: process.env.MEDUSA_DEVELOPER_API_TOKEN,
  });

  constructor(
    private shopifyApiBySession: ShopifyApiBySession,
    private readonly loggerService: LoggerService,
  ) {}

  @Command({
    command: 'syncMedusaShippings',
  })
  async syncMedusaShippings(): Promise<void> {
    const response: RequestReturn<{
      data: { deliveryProfiles: { nodes: DeliveryProfile[] } };
    }> = await (
      await this.shopifyApiBySession.getGraphqlClient()
    ).query({
      data: {
        query: `query getShippingProfiles {
					deliveryProfiles(first: 250) {
						nodes {
							name
							profileLocationGroups {
								locationGroupZones(first: 2) {
									nodes {
										zone {
											name
										}
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
														... on MoneyV2 {
															amount
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
				}`,
      },
    });

    const shopifyProfiles = response.body.data.deliveryProfiles.nodes;

    this.logger.log(`Syncing ${shopifyProfiles.length} profiles in Medusa`);

    const { regions } = await this.medusaClient.admin.regions.list({
      limit: 1,
    });
    const mainRegion = first(regions);
    if (!mainRegion) {
      throw new Error('No region found for this store');
    }

    this.logger.log(`Clearing custom profiles...`);

    for (const { name, profileLocationGroups } of shopifyProfiles) {
      this.logger.log(`Syncing profile ${name}`);

      const shippingCondition = shippingConditions.find(
        (shippingCondition) => shippingCondition.profile === name,
      );

      const vendors = shippingCondition?.conditions
        .filter((condition) => condition.key === 'Vendor')
        .map((condition) => condition.value);

      const { shipping_profile } =
        await this.medusaClient.admin.shippingProfiles.create({
          name,
          type: ShippingProfileType.CUSTOM,
          metadata: {
            vendorNames: vendors,
          },
        });

      const methods = profileLocationGroups.flatMap((profileLocationGroup) =>
        profileLocationGroup.locationGroupZones.nodes.flatMap(
          (groupZone) => groupZone.methodDefinitions.nodes,
        ),
      );

      for (const method of methods) {
        await this.medusaClient.admin.shippingOptions.create({
          name: method.name,
          profile_id: shipping_profile.id,
          price_type: ShippingOptionPriceType.FLAT_RATE,
          amount: toCents(
            (method.rateProvider as DeliveryRateDefinition).price.amount,
          ),
          region_id: mainRegion.id,
          data: {},
          provider_id: 'manual',
          metadata: {
            extra_requirements: method.methodConditions
              .filter(
                (methodCondition) =>
                  methodCondition.field === DeliveryConditionField.TotalWeight,
              )
              .map((methodCondition) => ({
                value: Number(
                  (methodCondition.conditionCriteria as Weight).value,
                ),
                type:
                  methodCondition.operator ===
                  DeliveryConditionOperator.GreaterThanOrEqualTo
                    ? WeidhtRequirementType.MIN_WEIGHT
                    : WeidhtRequirementType.MAX_WEIGHT,
              })),
          },
          requirements: method.methodConditions
            .filter(
              (methodCondition) =>
                methodCondition.field === DeliveryConditionField.TotalPrice,
            )
            .map((methodCondition) => ({
              amount: toCents(
                (methodCondition.conditionCriteria as MoneyV2).amount,
              ),
              type:
                methodCondition.operator ===
                DeliveryConditionOperator.GreaterThanOrEqualTo
                  ? RequirementType.MIN_SUBTOTAL
                  : RequirementType.MAX_SUBTOTAL,
            })),
        });
      }

      this.logger.log(`Done with id ${shipping_profile.id}`);
    }
  }
}
