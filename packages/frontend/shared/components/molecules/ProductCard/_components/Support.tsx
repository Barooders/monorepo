import { sendNewSalesCall } from '@/analytics';
import Link from '@/components/atoms/Link';
import { getDictionary } from '@/i18n/translate';
import { PiHeadset } from 'react-icons/pi';

const dict = getDictionary('fr');

const SupportPicture = () => (
  <span className="flex h-[70px] w-[70px] overflow-hidden rounded-full border-4 border-solid border-white bg-gray-200 shadow">
    <img
      src="https://cdn.shopify.com/s/files/1/0576/4340/1365/files/expert_velo_x80.jpg"
      loading="lazy"
      width="80"
      height="80"
      className="flex h-[70px] w-[70px] rounded-full object-cover"
    />
  </span>
);

const Support: React.FC<{ productPrice: number }> = ({ productPrice }) => {
  return (
    <div className="flex justify-start gap-2 rounded-lg border border-slate-300 p-3">
      <PiHeadset className="my-1" />
      <div className="flex flex-col gap-2">
        <p className="flex items-center gap-2 font-medium uppercase">
          {dict.components.productCard.support.catchphrase}
        </p>
        <div className="flex items-center gap-3 text-sm">
          <SupportPicture />
          <p>
            <Link
              href="tel:+33189713290"
              onClick={() => sendNewSalesCall(productPrice)}
            >
              <strong>+33 1 89 71 32 90</strong>
            </Link>
            {dict.components.productCard.support.content()}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Support;
