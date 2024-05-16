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
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fe401602f6e1049b6a75a3ae4f24739d1',
  },
  {
    ...dict.homepage.whyBarooders.quality,
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F24a9864e136546768fafe0156f9c3068',
  },
  {
    ...dict.homepage.whyBarooders.experts,
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fa887a13666484711997756963c2a387d',
  },
  {
    ...dict.homepage.whyBarooders.green,
    source:
      'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F08e91772aa7d4edd98b020efe4fcc5eb',
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
