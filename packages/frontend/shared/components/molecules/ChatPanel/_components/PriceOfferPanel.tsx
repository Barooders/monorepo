import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Modal from '@/components/atoms/Modal';
import MakeOfferModal from '@/components/molecules/MakeOfferModal';
import useUser from '@/hooks/state/useUser';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import {
  NegociationAgreementType,
  PriceOffer,
  PriceOfferStatus,
} from '@/types';
import { FaCopy } from 'react-icons/fa6';
import BuyButton from './BuyButton';

const dict = getDictionary('fr');

type PropsType = {
  proposedPriceOffer: PriceOffer;
  productHandle: string;
  isBuyer?: boolean;
  negociationAgreement: NegociationAgreementType | null;
  productId: string;
  buyerId: string;
  originalPrice?: number;
};

const PriceOfferPanel: React.FC<PropsType> = ({
  proposedPriceOffer,
  productHandle,
  isBuyer,
  negociationAgreement,
  productId,
  buyerId,
  originalPrice,
}) => {
  const { fetchAPI } = useBackend();
  const { hasuraToken } = useUser();

  const updatePriceOfferStatus = async (status: PriceOfferStatus) => {
    await fetchAPI(`/v1/price-offer/${proposedPriceOffer.id}`, {
      method: 'PUT',
      body: JSON.stringify({
        status,
      }),
    });
  };

  const [fetchState, doUpdateStatus] = useWrappedAsyncFn(
    updatePriceOfferStatus,
  );

  if (!hasuraToken) {
    return <></>;
  }

  const copyDiscountCode = () =>
    navigator.clipboard.writeText(proposedPriceOffer.discountCode ?? '');

  return (
    <div className="flex h-full w-full items-center justify-center gap-3 border-t border-gray-300">
      {fetchState.loading ? (
        <Loader />
      ) : proposedPriceOffer.status === PriceOfferStatus.ACCEPTED ? (
        <>
          <div className="flex items-center justify-center gap-1 text-sm">
            {dict.components.chatPanel.acceptedPriceOffer}{' '}
            <button
              className="flex cursor-pointer items-center justify-center gap-1 rounded  border border-gray-800 p-1 font-semibold text-gray-800 hover:border-gray-600 hover:text-gray-600"
              onClick={copyDiscountCode}
            >
              <span>{proposedPriceOffer.discountCode}</span>
              <FaCopy />
            </button>
          </div>
          {hasuraToken.user.id === proposedPriceOffer.initiatorId && (
            <BuyButton handle={productHandle} />
          )}
        </>
      ) : hasuraToken.user.id === proposedPriceOffer.initiatorId ? (
        <>
          <Button
            intent="tertiary"
            onClick={() => doUpdateStatus(PriceOfferStatus.CANCELED)}
            size="small"
          >
            {dict.components.chatPanel.cancelPriceOffer}
          </Button>
          {isBuyer && <BuyButton handle={productHandle} />}
        </>
      ) : (
        <>
          <Button
            intent="secondary"
            onClick={() => doUpdateStatus(PriceOfferStatus.ACCEPTED)}
            size="small"
          >
            {dict.components.chatPanel.acceptPriceOffer}
          </Button>
          <Button
            intent="tertiary"
            onClick={() => doUpdateStatus(PriceOfferStatus.DECLINED)}
            size="small"
          >
            {dict.components.chatPanel.declinePriceOffer}
          </Button>
          <Modal
            ButtonComponent={({ openModal }) => (
              <Button
                intent="tertiary"
                onClick={openModal}
                size="small"
              >
                {dict.components.chatPanel.counterOffer}
              </Button>
            )}
            ContentComponent={({ closeModal }) =>
              originalPrice &&
              negociationAgreement?.maxAmountPercent && (
                <MakeOfferModal
                  originalPrice={originalPrice}
                  productId={productId}
                  closeModal={closeModal}
                  negociationMaxAmountPercent={
                    negociationAgreement.maxAmountPercent
                  }
                  shouldRedirectToChat={false}
                  buyerId={buyerId}
                  onSuccess={() => doUpdateStatus(PriceOfferStatus.DECLINED)}
                />
              )
            }
          />
        </>
      )}
    </div>
  );
};

export default PriceOfferPanel;
