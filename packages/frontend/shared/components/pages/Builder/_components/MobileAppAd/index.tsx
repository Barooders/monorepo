import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import { daysSince } from '@/utils/date';
import { FaStar } from 'react-icons/fa';

const dict = getDictionary('fr');

type PropsType = {
  reviews: {
    title: string;
    since: string;
    content: string;
    author: string;
  }[];
};

const MobileAppAd: React.FC<PropsType> = ({ reviews }) => (
  <div className="bg-[#20292F]">
    <div className="relative mx-auto max-w-page-content p-5 py-12">
      <div className="flex flex-col items-start gap-7 text-white">
        <img
          width="80px"
          src="/mobile-platforms.jpg"
        />
        <div>
          <p className="mb-1 text-lg font-semibold md:text-2xl">
            {dict.homepage.mobileSection.title}
          </p>
          <p className="text-xs font-light">
            {dict.homepage.mobileSection.subtitle}
          </p>
        </div>
        <Button
          intent="primary"
          href="https://apps.apple.com/fr/app/barooders-le-sport-doccasion/id6444026059"
          className="text-xs font-medium uppercase"
        >
          {dict.homepage.mobileSection.downloadApp}
        </Button>
        <div className="flex w-full gap-2 overflow-auto">
          {reviews.map((review, idx) => (
            <div
              key={`${review.title}-${idx}`}
              className="flex min-w-[260px] flex-col gap-2 rounded-lg bg-[#2b3438] p-4 text-xs text-white"
            >
              <div className="mb-1 flex gap-1">
                <FaStar className="text-[#FFAB00]" />
                <FaStar className="text-[#FFAB00]" />
                <FaStar className="text-[#FFAB00]" />
                <FaStar className="text-[#FFAB00]" />
                <FaStar className="text-[#FFAB00]" />
              </div>
              <div>
                <p className="font-semibold">{review.title}</p>
                <p className="font-light text-slate-500">
                  {review.author},{' '}
                  {dict.components.trustpilot.since({
                    daysCount: daysSince(review.since),
                  })}
                </p>
              </div>
              <p className="font-light">{review.content}</p>
            </div>
          ))}
        </div>
      </div>

      <img
        src="/mobile-app-preview.png"
        className="absolute right-0 top-0 z-10 hidden h-full -translate-x-8 scale-110 lg:block"
      />
    </div>
  </div>
);

export default MobileAppAd;
