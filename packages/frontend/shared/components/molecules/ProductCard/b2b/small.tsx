import useOpenedOffersState from '@/components/pages/ProPage/_state/useOpenedOffersState';
import B2BPriceOfferButton, {
  ExistingOfferComponent,
} from '../_components/Actions/B2BPriceOfferButton';
import Characteristics from '../_components/Characteristics';
import ProductImage from '../_components/ProductImage';
import BundlePrice from '../_components/ProductPrice/BundlePrice';
import { B2BProductCardProps } from '../types';

const B2BProductSmallCard: React.FC<
  B2BProductCardProps & { openDetails: (productInternalId: string) => void }
> = ({
  id,
  vendorId,
  title,
  tags,
  productType,
  variantCondition,
  price,
  compareAtPrice,
  largestBundlePrice,
  image,
  stock,
  openDetails,
}) => {
  const { hasOpenedPriceOffer } = useOpenedOffersState();
  return (
    <div className="h-full w-36 shrink-0 flex-col gap-2 sm:w-52 lg:w-72">
      <div
        onClick={() => openDetails(id)}
        className="flex cursor-pointer flex-col gap-1"
      >
        <div className={`relative h-40 w-full`}>
          {image && (
            <ProductImage
              image={image}
              labels={[]}
              discounts={[]}
            />
          )}
        </div>
        <Characteristics
          tags={tags}
          title={title}
          productType={productType}
          variantCondition={variantCondition}
          componentSize="medium"
        />
        <BundlePrice
          className="my-1"
          compareAtPrice={compareAtPrice}
          price={price}
          largestBundlePrice={largestBundlePrice}
          stock={stock}
        />
      </div>

      {hasOpenedPriceOffer(id) ? (
        <ExistingOfferComponent className="flex-1" />
      ) : (
        <></>
      )}
      <B2BPriceOfferButton
        className="flex-1"
        productId={id}
        vendorId={vendorId}
        openDetails={openDetails}
      />
    </div>
  );
};

export default B2BProductSmallCard;
