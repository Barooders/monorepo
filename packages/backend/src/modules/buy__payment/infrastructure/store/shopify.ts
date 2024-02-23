import { ShopifyApiBySession } from '@libs/infrastructure/shopify/shopify-api/shopify-api-by-session.lib';
import { IStore } from '@modules/buy__payment/domain/ports/store.repository';
import { CheckoutDetailsType } from '@modules/buy__payment/domain/types';
import { Injectable } from '@nestjs/common';

@Injectable()
export class ShopifyStore implements IStore {
  constructor(private readonly shopifyApiBySession: ShopifyApiBySession) {}

  async validateCart(checkoutToken: string): Promise<void> {
    const shopify = this.shopifyApiBySession.getInstance();
    const session = await this.shopifyApiBySession.getSession();

    const checkout = new shopify.rest.Checkout({ session });
    checkout.token = checkoutToken;
    await checkout.complete({});
  }
  async getCheckoutUrl(checkoutToken: string): Promise<string | undefined> {
    const shopify = this.shopifyApiBySession.getInstance();
    const session = await this.shopifyApiBySession.getSession();

    const checkout = await shopify.rest.Checkout.find({
      session: session,
      token: checkoutToken,
    });

    return `${checkout?.web_url}/payment#custom-payment-container` ?? undefined;
  }

  async getCheckoutDetails(
    checkoutToken: string,
  ): Promise<CheckoutDetailsType> {
    const shopify = this.shopifyApiBySession.getInstance();
    const session = await this.shopifyApiBySession.getSession();

    const checkout = await shopify.rest.Checkout.find({
      session: session,
      token: checkoutToken,
    });

    return {
      discountAmount: {
        amountInCents: Math.round(
          Number(checkout?.applied_discount?.amount ?? 0) * 100,
        ),
        currency: 'EUR',
      },
      shippingAmount: {
        amountInCents: Math.round(
          Number(checkout?.shipping_line?.price ?? 0) * 100,
        ),
        currency: 'EUR',
      },
      productsAmount: {
        amountInCents:
          Number(
            checkout?.line_items?.reduce(
              (total, line) => total + Number(line.price),
              0,
            ),
          ) * 100,
        currency: 'EUR',
      },
    };
  }
}
