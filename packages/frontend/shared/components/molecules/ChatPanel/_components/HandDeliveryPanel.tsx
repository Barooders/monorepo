'use client';

import Link from '@/components/atoms/Link';
import useUser from '@/hooks/state/useUser';
import useValidateHandDeliveryOrder from '@/hooks/useValidateHandDeliveryOrder';
import { useState } from 'react';

type PropsType = {
  orderShopifyId: string;
  conversationId: string;
};

const HandDeliveryPanel: React.FC<PropsType> = ({
  orderShopifyId,
  conversationId,
}) => {
  const [, validateHandDeliveryOrder] = useValidateHandDeliveryOrder();
  const { hasuraToken } = useUser();
  const [showButtonsPanel, setShowButtonsPanel] = useState(true);

  const showSupportAlert = () =>
    alert(
      'Une erreur est survenue, veuillez contacter le support (support@barooders.com)',
    );

  const validateOrder = async () => {
    if (!confirm("L'échange s'est bien passé? Si oui, cliquez sur OK")) {
      return;
    }

    const isSuccess = await validateHandDeliveryOrder(
      orderShopifyId,
      conversationId,
      hasuraToken?.accessToken ?? '',
    );

    if (!isSuccess) {
      showSupportAlert();
      return;
    }

    setShowButtonsPanel(false);

    alert(
      `C'est tout bon ! Votre commande est validée et le paiement du vendeur va être débloqué.`,
    );
  };

  return (
    <div className="absolute bottom-0 mx-4 mb-4 rounded-md border-2 border-slate-200 p-4 font-twemoji text-sm md:text-base">
      <p className="font-bold">Bravo pour votre commande !</p>
      {showButtonsPanel ? (
        <>
          <p className="mt-1">
            Une confirmation est requise pour clôturer la vente et déclencher le
            paiement du vendeur. Sans réponse de votre part sous 24h cela sera
            fait automatiquement.
          </p>
          <div className="mt-2 flex items-center justify-center gap-5">
            <button
              className="rounded-md bg-blue-600 px-6 py-3 text-white"
              onClick={validateOrder}
            >
              Je valide la commande
            </button>
            <Link
              className="rounded-md bg-slate-100 px-6 py-3"
              href="https://barooders.com/pages/nous-contacter"
              target="_blank"
              rel="noreferrer"
            >
              Je signale un litige
            </Link>
          </div>
        </>
      ) : (
        <>
          <p className="mt-1">Votre commande a été validée.</p>
        </>
      )}
    </div>
  );
};

export default HandDeliveryPanel;
