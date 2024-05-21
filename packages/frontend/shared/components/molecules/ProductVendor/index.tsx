import ProductVendorCard from './card';
import SmallProductVendor from './small';

export type ProductVendorProps = {
  vendor: string;
  isPro?: boolean;
  withLink?: boolean;
  rating?: number;
  reviewCount?: number;
  withSeeAllLink?: boolean;
  productInternalId?: string;
};

const ProductVendor: React.FC<
  ProductVendorProps & { size?: 'small' | 'card' }
> = (props) => {
  if (props.size === 'card') {
    return <ProductVendorCard {...props} />;
  }

  return <SmallProductVendor {...props} />;
};

export default ProductVendor;
