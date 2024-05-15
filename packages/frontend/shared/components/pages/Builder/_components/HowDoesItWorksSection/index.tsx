'use client';

import { getDictionary } from '@/i18n/translate';
import { ComponentProps } from 'react';
import PanelsInTabs, { AvailableIcons } from '../PanelsInTabs';

const dict = getDictionary('fr');

const tabs: ComponentProps<typeof PanelsInTabs> = {
  tabs: [
    {
      title: dict.homepage.howDoesItWorks.buy.title,
      panels: [
        {
          icon: AvailableIcons.SEARCH,
          title: dict.homepage.howDoesItWorks.buy.chooseBike.title,
          content: dict.homepage.howDoesItWorks.buy.chooseBike.content,
        },
        {
          icon: AvailableIcons.SHIELD,
          title: dict.homepage.howDoesItWorks.buy.buySafely.title,
          content: dict.homepage.howDoesItWorks.buy.buySafely.content,
        },
        {
          icon: AvailableIcons.BIKE,
          title: dict.homepage.howDoesItWorks.buy.tryBike.title,
          content: dict.homepage.howDoesItWorks.buy.tryBike.content,
        },
      ],
    },
    {
      title: dict.homepage.howDoesItWorks.sell.title,
      panels: [
        {
          icon: AvailableIcons.CYCLE,
          title: dict.homepage.howDoesItWorks.sell.publish.title,
          content: dict.homepage.howDoesItWorks.sell.publish.content,
        },
        {
          icon: AvailableIcons.SHIELD,
          title: dict.homepage.howDoesItWorks.sell.sellSafely.title,
          content: dict.homepage.howDoesItWorks.sell.sellSafely.content,
        },
        {
          icon: AvailableIcons.CHECK,
          title: dict.homepage.howDoesItWorks.sell.receiveMoney.title,
          content: dict.homepage.howDoesItWorks.sell.receiveMoney.content,
        },
      ],
    },
  ],
};

const HowDoesItWorksSection = () => {
  return (
    <>
      <h2 className="mb-4 text-center text-2xl font-bold">
        {dict.homepage.howDoesItWorks.title}
      </h2>
      <PanelsInTabs {...tabs} />
    </>
  );
};

export default HowDoesItWorksSection;
