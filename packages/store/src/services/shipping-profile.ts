import {
  Cart,
  ShippingProfileService as MedusaShippingProfileService,
} from '@medusajs/medusa';

const GUARANTEE_TITLE = 'Garantie Barooders';

class ShippingProfileService extends MedusaShippingProfileService {
  async getProfilesInCart(cart: Cart): Promise<string[]> {
    const profileIds = new Set<string>();

    cart.items
      .filter((item) => item.title !== GUARANTEE_TITLE)
      .forEach((item) => {
        item.variant.product.profiles.forEach(({ id }) => profileIds.add(id));
      });

    return [...profileIds];
  }
}

export default ShippingProfileService;
