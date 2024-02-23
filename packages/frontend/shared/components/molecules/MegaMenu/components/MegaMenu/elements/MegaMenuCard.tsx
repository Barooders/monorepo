import Link from '@/components/atoms/Link';
import Button from '@/components/molecules/MegaMenu/elements/UI/Button';

import { MegaMenuCardType } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';

type Props = {
  card: MegaMenuCardType;
};

const MegaMenuCard = ({ card }: Props) => (
  <Link
    className="flex h-full"
    href={card.url}
    target={card.target || undefined}
  >
    <figure className="flex flex-col">
      <div className="mb-auto">
        <img src={card.image.attributes.url} />
      </div>
      <div className="mt-3 flex justify-center text-center">
        <figcaption className="font-semibold">{card.title}</figcaption>
      </div>
      {card.button_text && (
        <div className="mt-3 flex justify-center px-4">
          <Button variant="primary">{card.button_text}</Button>
        </div>
      )}
    </figure>
  </Link>
);

export default MegaMenuCard;
