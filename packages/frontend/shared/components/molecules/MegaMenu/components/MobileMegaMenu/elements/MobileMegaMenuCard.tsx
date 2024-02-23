import Link from '@/components/atoms/Link';
import { MegaMenuCardType } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';

type Props = {
  card: MegaMenuCardType;
  className?: string;
};

const MobileMegaMenuCard = ({ card, className }: Props) => {
  const text = card.button_text || card.title;

  return (
    <li className="relative">
      <Link
        className={`mt-4 flex w-full rounded-lg bg-secondary-200 px-4 py-2 ${className}`}
        href={card.url}
        target={card.target || undefined}
      >
        <div className="my-auto flex w-2/3 items-center">
          <h6 className="text-lg font-semibold leading-5">{text}</h6>
        </div>

        <div className="my-auto w-1/3">
          <img src={card.image.attributes.url} />
        </div>
      </Link>
    </li>
  );
};

export default MobileMegaMenuCard;
