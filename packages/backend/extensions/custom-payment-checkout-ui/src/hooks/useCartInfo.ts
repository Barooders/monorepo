import {
  useCartLines,
  useCheckoutToken,
  useTotalAmount,
} from '@shopify/ui-extensions-react/checkout';
import { fromStorefrontId } from '../libs/storefrontId';

export type CartInfoType = {
  storeId: string;
  totalAmount: {
    amountInCents: number;
    currency: string;
  };
  productsCount: number;
  products: {
    amount: {
      amountInCents: number;
      currency: string;
    };
    shipping: string;
    productType: string;
    id: string;
  }[];
};

const useCartInfo = (): CartInfoType => {
  const checkoutToken = useCheckoutToken();
  const cartLines = useCartLines();
  const totalAmount = useTotalAmount();

  return {
    productsCount: cartLines.length,
    totalAmount: {
      amountInCents: Math.round(totalAmount.amount * 100),
      currency: totalAmount.currencyCode,
    },
    storeId: checkoutToken,
    products: cartLines.map((line) => ({
      productType: !!line.merchandise.product.productType
        ? line.merchandise.product.productType
        : 'Unknown',
      amount: {
        amountInCents: Math.round(line.cost.totalAmount.amount * 100),
        currency: line.cost.totalAmount.currencyCode,
      },
      shipping: line.merchandise.requiresShipping ? 'STD' : 'VIR',
      id: fromStorefrontId(line.merchandise.product.id, 'Product'),
    })),
  };
};

export default useCartInfo;
