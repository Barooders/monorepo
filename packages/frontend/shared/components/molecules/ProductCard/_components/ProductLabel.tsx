import { CardLabel } from '../types';

type PropsType = {
  label: CardLabel;
  stickSide?: 'left' | 'right';
};

const ProductLabel: React.FC<PropsType> = ({ label, stickSide }) => {
  const backgroundColorStyles = {
    white: 'bg-white',
    blue: 'bg-blue-200 text-blue-600',
    purple: 'bg-fuchsia-200',
    primary: 'bg-primary-400 text-white',
  };

  return (
    <div
      className={`min-w-16 rounded-md ${
        stickSide === 'left'
          ? 'rounded-l-none'
          : stickSide === 'right'
            ? 'rounded-r-none'
            : ''
      } ${
        backgroundColorStyles[label.color] ?? backgroundColorStyles.white
      } px-1 py-1 text-xs font-semibold shadow md:py-1`}
    >
      {label.content}
    </div>
  );
};

export default ProductLabel;
