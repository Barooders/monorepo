import Button from '@/components/atoms/Button';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type PropsType = {
  handle: string;
};

const BuyButton: React.FC<PropsType> = ({ handle }) => {
  return (
    <Button
      intent="secondary"
      onClick={() => {
        window.location.href = `/products/${handle}`;
      }}
      size="small"
    >
      {dict.components.chatPanel.buyNow}
    </Button>
  );
};

export default BuyButton;
