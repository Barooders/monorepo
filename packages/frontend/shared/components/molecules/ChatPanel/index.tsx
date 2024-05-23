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
import PriceOfferPanel from './_components/PriceOfferPanel';

export type AssociatedOrderLine = {
  shippingSolution: ShippingSolution;
  orderShopifyId: number;
};

export type AssociatedProductDetails = {
  handle: string;
  internalId: string;
  originalPrice: number;
  vendorInternalId: string;
};

export type PropsType = {
  loading: boolean;
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
              productInternalId={productDetails.internalId ?? ''}
              negociationMaxAmountPercent={
                negociationAgreement.maxAmountPercent
              }
              buyerInternalId={conversation.customerInternalId}
              price={productDetails.originalPrice}
              variantInternalId={undefined}
              size="small"
            />
          )}
          {productDetails.vendorInternalId !== user?.id && (
            <BuyButton handle={productDetails.handle} />
          )}
        </div>
      ),
  },
  [PANELS.PRICE_OFFER]: {
    canDisplay: ({ proposedPriceOffer }) => !!proposedPriceOffer?.id,
    height: SMALL_PANEL_HEIGHT,
    renderPanel: ({
      proposedPriceOffer,
      productDetails,
      user,
      negociationAgreement,
      conversation,
    }) =>
      proposedPriceOffer && (
        <PriceOfferPanel
          negociationAgreement={negociationAgreement}
          productInternalId={productDetails?.internalId}
          proposedPriceOffer={proposedPriceOffer}
          productHandle={productDetails?.handle ?? ''}
          isBuyer={productDetails?.vendorInternalId !== user?.id}
          buyerInternalId={conversation.customerInternalId}
          originalPrice={productDetails?.originalPrice}
        />
      ),
  },
};

const panelOrder = [PANELS.PRICE_OFFER, PANELS.ACTION_BUTTONS];

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
