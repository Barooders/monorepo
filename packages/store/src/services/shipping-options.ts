import {
  Cart,
  ShippingOptionService as MedusaShippingOptionService,
  ShippingOption,
} from '@medusajs/medusa';
import { first } from 'lodash';

type ExtraRequirement = { type: 'min_weight' | 'max_weight'; value: number };

class ShippingOptionService extends MedusaShippingOptionService {
  async validateCartOption(
    option: ShippingOption,
    cart: Cart,
  ): Promise<ShippingOption | null> {
    const validShippingOption = await super.validateCartOption(option, cart);

    if (validShippingOption === null) return null;

    const extraRequirements = validShippingOption.metadata
      ?.extra_requirements as ExtraRequirement[];

    if (extraRequirements === undefined || extraRequirements.length === 0) {
      return validShippingOption;
    }

    const heaviestVariant = first(
      cart.items
        .map((item) => item.variant)
        .sort((a, b) => (a.weight ?? 0) - (b.weight ?? 0)),
    );

    if (heaviestVariant === undefined || heaviestVariant.weight === null) {
      return validShippingOption;
    }

    const heaviestVariantWeight = heaviestVariant.weight;

    if (
      extraRequirements.some(
        (extraRequirement) =>
          (extraRequirement.type === 'max_weight' &&
            heaviestVariantWeight > extraRequirement.value) ||
          (extraRequirement.type === 'min_weight' &&
            heaviestVariantWeight < extraRequirement.value),
      )
    ) {
      throw new Error(
        'Heaviest variant does not respect weight conditions for this method',
      );
    }

    return validShippingOption;
  }
}

export default ShippingOptionService;
