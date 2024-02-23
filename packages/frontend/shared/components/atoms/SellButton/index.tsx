import { getDictionary } from '@/i18n/translate';
import Link from '@/components/atoms/Link';
import { FiPlus } from 'react-icons/fi';

const dict = getDictionary('fr');

const SellButton = () => (
  <Link
    href="/selling-form/create"
    className="flex justify-center rounded-md bg-primary-600 py-[8px] px-[15px] text-base text-white"
  >
    <span className="flex flex-row items-center gap-2 text-sm font-semibold uppercase tracking-[.15em]">
      <FiPlus size="20px" />
      <span>{dict.header.sell.buttonLabel}</span>
    </span>
  </Link>
);

export default SellButton;
