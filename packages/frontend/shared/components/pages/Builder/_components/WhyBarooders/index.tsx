import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type ReasonToChooseBaroodersPropsType = {
  source: string;
  title: string;
  description: string;
};

const ReasonToChooseBarooders: React.FC<ReasonToChooseBaroodersPropsType> = ({
  source,
  title,
  description,
}) => {
  return (
    <div className="flex min-w-[200px] flex-col gap-2 rounded-xl bg-[#f3f5f7] p-6 md:min-w-[320px]">
      <img
        src={source}
        className="min-h-[20px] w-full min-w-[20px] max-w-[40px] object-contain object-center md:max-w-[60px]"
      />
      <span className="overflow-hidden whitespace-nowrap text-lg font-semibold md:text-xl">
        {title}
      </span>
      <span className="text-xs leading-normal text-slate-600 md:text-sm">
        {description}
      </span>
    </div>
  );
};

const reasons = [
  {
    ...dict.homepage.whyBarooders.warranty,
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/thumbnail_homepage_b_red_21eaa7bbe6.jpeg',
  },
  {
    ...dict.homepage.whyBarooders.quality,
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/thumbnail_homepage_b_quality_2598370eea.jpeg',
  },
  {
    ...dict.homepage.whyBarooders.experts,
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/thumbnail_homepage_b_experts_2dbfb9dbeb.jpeg',
  },
  {
    ...dict.homepage.whyBarooders.green,
    source:
      'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/thumbnail_homepage_b_green_a568baf812.jpeg',
  },
];

const WhyBarooders: React.FC = () => {
  return (
    <div className="flex gap-2 overflow-x-scroll">
      {reasons.map((reason, idx) => (
        <ReasonToChooseBarooders
          key={idx}
          {...reason}
        />
      ))}
    </div>
  );
};

export default WhyBarooders;
