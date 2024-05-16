import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';
import { HiLightningBolt } from 'react-icons/hi';

const dict = getDictionary('fr');

const BuyBackSection: React.FC = () => {
  return (
    <div className="mt-10 w-full bg-[#F3F5F7] p-5">
      <div className="mx-auto flex w-full max-w-[1000px] flex-col gap-5 md:flex-row">
        <div className="flex flex-col gap-4 md:w-3/5">
          <span className="flex items-center gap-2 text-sm font-semibold md:text-base">
            <HiLightningBolt /> {dict.homepage.buyback.title}
          </span>
          <span className="text-lg font-bold md:text-2xl">
            {dict.homepage.buyback.subtitle}
          </span>
          <span className="text-sm text-slate-600">
            {dict.homepage.buyback.description}
          </span>
          <Button
            intent="primary"
            href="https://barooders.com/reprise"
            target="_blank"
            className="w-fit"
          >
            {dict.homepage.buyback.buttonLabel}
          </Button>
        </div>
        <img
          className="object-cover md:w-2/5"
          src="https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F7620b4bf9d134ece9acc3064217b96d0?width=598"
        />
      </div>
    </div>
  );
};

export default BuyBackSection;
