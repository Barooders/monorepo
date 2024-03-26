'use client';

import Loader from '@/components/atoms/Loader';
import { ShippingSolution } from '@/components/pages/Account/types';
import {
  ConversationType,
  NegociationAgreementType,
  PriceOffer,
  User,
} from '@/types';
import { useEffect, useState } from 'react';
import PriceOfferButton from '../ProductCard/_components/Actions/PriceOfferButton';
import BuyButton from './_components/BuyButton';
import HandDeliveryPanel from './_components/HandDeliveryPanel';
import PriceOfferPanel from './_components/PriceOfferPanel';

export type AssociatedOrderLine = {
  productShopifyId: string;
  shippingSolution: ShippingSolution;
  orderShopifyId: string;
};

export type AssociatedProductDetails = {
  handle: string;
  id: string;
  originalPrice: number;
  vendorId: string;
};

export type PropsType = {
  loading: boolean;
  productId: string;
  conversation: ConversationType;
  associatedOrderLine: AssociatedOrderLine | null;
  negociationAgreement: NegociationAgreementType | null;
  productDetails: AssociatedProductDetails | null;
  proposedPriceOffer: PriceOffer | null;
  setPanelHeight: (height: number) => void;
  user?: User;
};

type PanelConfigType = {
  canDisplay: (props: PropsType) => boolean;
  height: number;
  renderPanel: React.FC<PropsType>;
};

enum PANELS {
  HAND_DELIVERY = 'HAND_DELIVERY',
  ACTION_BUTTONS = 'ACTION_BUTTONS',
  PRICE_OFFER = 'PRICE_OFFER',
}

const SMALL_PANEL_HEIGHT = 45;

const panelConfig: {
  [panelName: string]: PanelConfigType;
} = {
  [PANELS.ACTION_BUTTONS]: {
    canDisplay: ({ associatedOrderLine, productDetails }) =>
      !associatedOrderLine && !!productDetails,
    height: SMALL_PANEL_HEIGHT,
    renderPanel: ({
      productDetails,
      conversation,
      negociationAgreement,
      user,
    }) =>
      productDetails && (
        <div className="flex h-full w-full items-center justify-center gap-3 px-5">
          {negociationAgreement && (
            <PriceOfferButton
              productId={productDetails.id ?? ''}
              negociationMaxAmountPercent={
                negociationAgreement.maxAmountPercent
              }
              buyerId={conversation.customerId}
              price={productDetails.originalPrice}
              variant={undefined}
              size="small"
            />
          )}
          {productDetails.vendorId !== user?.id && (
            <BuyButton handle={productDetails.handle} />
          )}
        </div>
      ),
  },
  [PANELS.HAND_DELIVERY]: {
    canDisplay: ({ associatedOrderLine }) =>
      !!associatedOrderLine &&
      associatedOrderLine.shippingSolution === ShippingSolution.HAND_DELIVERY,
    height: 230,
    renderPanel: ({ conversation, associatedOrderLine }) =>
      associatedOrderLine && (
        <HandDeliveryPanel
          conversationId={conversation.id}
          orderShopifyId={associatedOrderLine.orderShopifyId}
        />
      ),
  },
  [PANELS.PRICE_OFFER]: {
    canDisplay: ({ proposedPriceOffer }) => !!proposedPriceOffer?.id,
    height: SMALL_PANEL_HEIGHT,
    renderPanel: ({ proposedPriceOffer, productDetails, user }) =>
      proposedPriceOffer && (
        <PriceOfferPanel
          proposedPriceOffer={proposedPriceOffer}
          productHandle={productDetails?.handle ?? ''}
          isBuyer={productDetails?.vendorId !== user?.id}
        />
      ),
  },
};

const panelOrder = [
  PANELS.HAND_DELIVERY,
  PANELS.PRICE_OFFER,
  PANELS.ACTION_BUTTONS,
];

const ChatPanel: React.FC<PropsType> = (props) => {
  const { loading, setPanelHeight } = props;
  const [panelToRender, setPanelToRender] = useState<PANELS | null>(null);

  useEffect(() => {
    setPanelToRender(
      panelOrder.find((panelName) =>
        panelConfig[panelName].canDisplay(props),
      ) ?? null,
    );
  }, [props]);

  useEffect(() => {
    if (!panelToRender) {
      setPanelHeight(0);
    } else {
      setPanelHeight(panelConfig[panelToRender].height);
    }
  }, [panelToRender, setPanelHeight]);

  if (!panelToRender) return <></>;
  if (loading) return <Loader />;

  const panelToRenderConfig = panelConfig[panelToRender];

  return (
    <div
      className="w-full border-t border-gray-300"
      style={{ height: panelToRenderConfig.height }}
    >
      {panelToRenderConfig.renderPanel(props)}
    </div>
  );
};

export default ChatPanel;
