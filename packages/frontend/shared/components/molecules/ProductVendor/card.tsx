import Button from '@/components/atoms/Button';
import LinkWrapper from '@/components/atoms/Link/LinkWrapper';
import SmallReviewLink from '@/components/molecules/Reviews/SmallReviewLink';
import { getDictionary } from '@/i18n/translate';
import { FaCircleCheck } from 'react-icons/fa6';
import { ProductVendorProps } from '.';

const dict = getDictionary('fr');

const ProductVendorCard: React.FC<ProductVendorProps> = ({
  vendor,
  withLink = false,
  withSeeAllLink = true,
  rating,
  reviewCount,
  productShopifyId,
}) => {
  const textStyle = 'leading-4 tracking-tight';
  return (
    <div className="flex justify-between gap-2 rounded border border-slate-300 px-2 py-2">
      <div
        className={`flex flex-col justify-center gap-1 ${textStyle} text-sm`}
      >
        <div className="flex items-center justify-center gap-1">
          <span className="text-slate-500">
            {dict.components.productCard.soldBy}
          </span>{' '}
          <LinkWrapper
            href={`/collections/vendors?q=${encodeURIComponent(vendor)}`}
            className="text-slate-900"
            shouldWrap={withLink}
          >
            {vendor}
          </LinkWrapper>
          <div
            className={`ml-2 flex items-center gap-1 rounded bg-blue-200 px-1 ${textStyle} text-[11px] font-semibold text-blue-500`}
          >
            <FaCircleCheck />
            <span>{dict.components.productCard.vendor.proVendor}</span>
          </div>
        </div>
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
      {productShopifyId && (
        <Button
          className={`text-sm uppercase`}
          intent="discrete"
          href={`/pages/chat?product=${productShopifyId}`}
        >
          {dict.components.productCard.chatNow}
        </Button>
      )}
    </div>
  );
};

export default ProductVendorCard;
