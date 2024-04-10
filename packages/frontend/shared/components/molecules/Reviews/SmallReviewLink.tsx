'use client';

import Link from '@/components/atoms/Link';
import LinkWrapper from '@/components/atoms/Link/LinkWrapper';
import { getDictionary } from '@/i18n/translate';
import ReviewStars from './ReviewStars';
import { REVIEW_BLOCK_ANCHOR } from './container';

const dict = getDictionary('fr');

type PropsType = {
  vendor: string;
  rating: number;
  className?: string;
  reviewCount: number;
  withSeeAllLink?: boolean;
  size?: 'compact';
};

const SmallReviewLink: React.FC<PropsType> = ({
  rating,
  vendor,
  className,
  reviewCount,
  withSeeAllLink = true,
  size,
}) => {
  const goToReviews = () => {
    const reviewContainer = document.getElementById(REVIEW_BLOCK_ANCHOR);
    if (!reviewContainer) {
      window.location.href = `/collections/vendor?q=${encodeURIComponent(
        vendor,
      )}`;
      return;
    }

    reviewContainer.scrollIntoView({ behavior: 'smooth' });
  };

  if (size === 'compact') {
    return (
      <div className={`flex items-center gap-1 text-sm ${className}`}>
        <ReviewStars rating={rating} />
        <p className="text-slate-400">({reviewCount})</p>
        {withSeeAllLink && (
          <Link
            onClick={goToReviews}
            className="font-semibold underline"
          >
            {dict.components.productCard.reviews.seeReviews}
          </Link>
        )}
      </div>
    );
  }

  return (
    <LinkWrapper
      shouldWrap={withSeeAllLink}
      onClick={goToReviews}
      className={`flex items-center gap-1 text-xs font-semibold ${className}`}
    >
      <p>
        {reviewCount} {dict.components.productCard.reviews.reviews}
      </p>
      <div>·</div>
      <ReviewStars
        className="text-sm"
        rating={rating}
      />
    </LinkWrapper>
  );
};

export default SmallReviewLink;
