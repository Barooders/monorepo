import { ReviewType } from '@/components/molecules/Reviews/container';
import SmallReviewLink from '@/components/molecules/Reviews/SmallReviewLink';
import { TrackedElements } from '@/config/e2e';
import { getDictionary } from '@/i18n/translate';
import { calculateAverageRatings } from '@/utils/rating';
import { useEffect, useState } from 'react';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import SortBy from '@/components/molecules/Filters/SortBy';

const dict = getDictionary('fr');

export type PropsType = {
  sellerName: string;
  coverPictureUrl?: string;
  description?: string;
  profilePictureUrl?: string;
  reviews: ReviewType[];
};

const SHORTEN_DESCRIPTION_LENGTH = 80;

const VendorHeader: React.FC<PropsType> = ({
  sellerName,
  coverPictureUrl,
  description,
  profilePictureUrl,
  reviews,
}) => {
  const { results } = useInstantSearch();
  const [isOpen, setIsOpen] = useState(false);
  const [displayedDescription, setDisplayedDescription] = useState(
    description?.substring(0, SHORTEN_DESCRIPTION_LENGTH),
  );

  const isHTMLDescription = /<\/?[a-z][\s\S]*>/i.test(description ?? '');

  const shouldShortenDescription =
    description && description.length > SHORTEN_DESCRIPTION_LENGTH;

  useEffect(() => {
    if (isOpen) {
      setDisplayedDescription(description);
    } else {
      setDisplayedDescription(
        description?.substring(0, SHORTEN_DESCRIPTION_LENGTH),
      );
    }
  }, [isOpen, description]);

  return (
    <div className="flex flex-col">
      {coverPictureUrl && (
        <div className="relative h-24 w-full lg:h-36">
          <div className="h-full w-full overflow-hidden rounded-xl">
            <img
              className="h-full w-full object-cover"
              src={coverPictureUrl}
            />
          </div>
          {profilePictureUrl && (
            <div className="absolute bottom-[-16px] left-4 h-20 w-20 overflow-hidden rounded-full border-2 border-white bg-white lg:h-28 lg:w-28">
              <img
                className="h-full w-full object-cover"
                src={profilePictureUrl}
              />
            </div>
          )}
        </div>
      )}
      <div className="mt-7 flex items-end gap-2">
        <h1 className="text-2xl font-semibold lg:text-3xl">
          {dict.search.shopOf}
          <span className="text-red-600">{sellerName}</span>
        </h1>
        <span
          className="text-lg font-light text-gray-500"
          data-id={TrackedElements.HITS_COUNT}
        >
          ( {results.nbHits} )
        </span>
      </div>
      {reviews && reviews.length > 0 && (
        <SmallReviewLink
          vendor={sellerName}
          rating={calculateAverageRatings(reviews.map(({ rating }) => rating))}
          reviewCount={reviews.length}
          className="mt-2"
        />
      )}
      <div className="mb-1 mt-3 flex items-start gap-2 lg:my-5">
        {isHTMLDescription ? (
          <div dangerouslySetInnerHTML={{ __html: description ?? '' }} />
        ) : (
          <>
            <div className="grow text-sm text-gray-500">
              {displayedDescription}
              {shouldShortenDescription && (
                <>
                  ...
                  <button
                    className="ml-2 text-gray-700 underline"
                    onClick={() => setIsOpen(!isOpen)}
                  >
                    {isOpen ? dict.search.showLess : dict.search.showMore}
                  </button>
                </>
              )}
            </div>
            <div className="hidden shrink-0 lg:flex">
              <SortBy />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default VendorHeader;
