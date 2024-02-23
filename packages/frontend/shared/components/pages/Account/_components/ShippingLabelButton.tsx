import Button from '@/components/atoms/Button';
import Callout, { CalloutTypes } from '@/components/atoms/Callout';
import Loader from '@/components/atoms/Loader';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import FileSaver from 'file-saver';

const dict = getDictionary('fr');

type PropsType = {
  orderId: string;
  orderName: string;
};

const ShippingLabelButton: React.FC<PropsType> = ({ orderId, orderName }) => {
  const { fetchAPI } = useBackend();
  const [state, getShippingLabel] = useWrappedAsyncFn(async (orderId) => {
    const pdfContent = await fetchAPI<ArrayBuffer>(
      `/v1/orders/${orderId}/shipping-label`,
      {
        method: 'POST',
        responseParsing: 'buffer',
      },
    );

    const file = new Blob([pdfContent], { type: 'application/pdf' });
    FileSaver.saveAs(file, `shipping-${orderName}.pdf`);
  });

  return (
    <>
      {state.error && (
        <Callout
          content={dict.global.errors.unknownError}
          type={CalloutTypes.ERROR}
        />
      )}
      <Button
        intent="primary"
        className="flex items-center justify-center sm:w-72"
        onClick={() => getShippingLabel(orderId)}
      >
        {state.loading ? (
          <Loader />
        ) : (
          dict.account.order.downloadShippingLabel.button
        )}
      </Button>
    </>
  );
};

export default ShippingLabelButton;
