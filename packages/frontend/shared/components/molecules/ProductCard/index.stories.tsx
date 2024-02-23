// Button.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import { canyonVTT } from '@/mockData/product';
import { patrick } from '@/mockData/vendor';
import { fromAPI } from '@/mappers/product';

import ProductCard from '.';
import { CardLabel } from './types';
import { poppins } from '@/document/fonts';

const product = fromAPI(canyonVTT);

const meta: Meta<typeof ProductCard> = {
  title: 'ProductCard',
  component: ProductCard,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-[380px]`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ProductCard>;

const price = parseInt(product.price.amount);
const labels: CardLabel[] = [];

if (price > 100 && price < 2500) {
  labels.push({
    color: 'blue',
    content: <>Payez en 4x</>,
    position: 'right',
  });
}

if (patrick.isPro) {
  labels.push({
    color: 'white',
    content: <>Pro</>,
    position: 'right',
  });
}

export const Simple: Story = {
  args: {
    images: [
      {
        src: product.featuredImage.src,
        altText: product.featuredImage.altText,
        width: 1000,
        height: 700,
      },
    ],
    labels,
    vendor: {
      id: patrick.authUserId,
      name: patrick.sellerName,
      createdAt: '2022-01-01',
      isPro: true,
      profilePicture: null,
      shipmentTimeframeSentence: 'Expédié sous 2 jours',
      negociationMaxAmountPercent: null,
      reviews: {
        count: 12,
        averageRating: 4.3,
      },
    },
    productType: product.productType,
    tags: {
      marque: product.brand ?? '',
      état: product.state ?? '',
      taille: 'Taille L',
      année: '2019',
      modele: product.model ?? '',
    },
    handle: 'toto',
  },
};
