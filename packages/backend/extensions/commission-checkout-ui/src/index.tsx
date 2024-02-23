import {
  Banner,
  useCartLines,
  BlockStack,
  useBuyerJourneyIntercept,
  List,
  ListItem,
  reactExtension,
  useTranslate,
} from '@shopify/ui-extensions-react/checkout';
import {
  NO_COMMISSION_PRODUCTS,
  PRODUCT_NAME,
} from './constants/commission-checkout-ui.constant';
import { fromStorefrontId } from './libs/storefrontId';

export default reactExtension('purchase.checkout.block.render', () => (
  <CommissionExtension />
));

export function CommissionExtension() {
  const translate = useTranslate();
  const cartLines = useCartLines();
  const noCommissionCart = cartLines.every((line) =>
    NO_COMMISSION_PRODUCTS.includes(
      fromStorefrontId(line.merchandise.product.id, 'Product'),
    ),
  );
  const shouldAddCommission = !noCommissionCart;

  const missingCommission =
    shouldAddCommission &&
    !cartLines.find((cartLine) =>
      cartLine.merchandise.title.includes(PRODUCT_NAME),
    );

  useBuyerJourneyIntercept(({ canBlockProgress }) =>
    canBlockProgress && missingCommission
      ? {
          behavior: 'block',
          reason: translate('defaultError'),
        }
      : {
          behavior: 'allow',
        },
  );

  return (
    <BlockStack spacing="loose">
      {missingCommission ? (
        <>
          <Banner status="critical">{translate('defaultError')}</Banner>
          <Banner
            status="critical"
            title={translate('blockingBannerTitle')}
          />
        </>
      ) : shouldAddCommission ? (
        <Banner
          status="success"
          title={translate('baroodersGuaranteesTitle')}
        >
          <List spacing="tight">
            {translate('baroodersGuarantees')
              .split(';')
              .map((guarantee) => (
                <ListItem>{guarantee}</ListItem>
              ))}
          </List>
        </Banner>
      ) : (
        <></>
      )}
    </BlockStack>
  );
}
