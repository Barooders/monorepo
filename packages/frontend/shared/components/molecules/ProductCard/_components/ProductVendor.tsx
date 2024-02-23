import SmallReviewLink from '@/components/molecules/Reviews/SmallReviewLink';
import { getDictionary } from '@/i18n/translate';
import LinkWrapper from './LinkWrapper';

const dict = getDictionary('fr');

const ProductVendor: React.FC<{
  vendor: string;
  withLink?: boolean;
  rating?: number;
  reviewCount?: number;
  withSeeAllLink?: boolean;
}> = ({
  vendor,
  withLink = false,
  withSeeAllLink = true,
  rating,
  reviewCount,
}) => (
  <div className="flex items-center gap-2">
    <p className="text-[11px] tracking-tight lg:text-sm">
      <span className="text-slate-600">
        {dict.components.productCard.soldBy}
      </span>{' '}
      <LinkWrapper
        href={`/collections/vendors?q=${encodeURIComponent(vendor)}`}
        className="text-slate-900"
        shouldWrap={withLink}
      >
        {vendor}
      </LinkWrapper>
    </p>
    {rating && reviewCount ? (
      <SmallReviewLink
        vendor={vendor}
        rating={rating}
        reviewCount={reviewCount}
        withSeeAllLink={withSeeAllLink}
      />
    ) : (
      <></>
    )}
  </div>
);

export default ProductVendor;
