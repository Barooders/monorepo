import { getDictionary } from '@/i18n/translate';
import { IoMdFlame } from 'react-icons/io';

const dict = getDictionary('fr');

type PropsType = {
  numberOfViews: number;
};

const ProductViews: React.FC<PropsType> = ({ numberOfViews }) => {
  return (
    numberOfViews > 10 && (
      <div className="flex items-center gap-1 text-sm">
        <IoMdFlame className="text-primary-400" />{' '}
        {dict.components.productCard.alreadySeenBy(numberOfViews)}
      </div>
    )
  );
};

export default ProductViews;
