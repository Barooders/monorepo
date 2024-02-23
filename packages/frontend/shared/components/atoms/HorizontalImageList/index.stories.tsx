import type { Meta, StoryObj } from '@storybook/react';

import HorizontalImageList from '.';
import { poppins } from '@/document/fonts';

const meta: Meta<typeof HorizontalImageList> = {
  title: 'HorizontalImageList',
  component: HorizontalImageList,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-[380px]`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof HorizontalImageList>;

export const SubCollections: Story = {
  args: {
    items: [
      {
        title: 'Vélos',
        pictureUrl:
          'https://cdn.shopify.com/s/files/1/0576/4340/1365/collections/VTT_2.png?crop=center&height=100&v=1681895159&width=100',
        link: 'https://barooders.com/collections/velo',
      },
      {
        title: "Chaussures de VTT et Vélo d'occasion",
        pictureUrl:
          'https://cdn.shopify.com/s/files/1/0576/4340/1365/collections/chaussures-velo-vtt.png?crop=center&height=100&v=1681895183&width=100',
        link: 'https://barooders.com/collections/chaussures-vtt-velo',
      },
      {
        title: 'Vêtements Vélo et VTT',
        pictureUrl:
          'https://cdn.shopify.com/s/files/1/0576/4340/1365/collections/vetement-de-velo-vtt.png?crop=center&height=100&v=1681895210&width=100',
        link: 'https://barooders.com/collections/vetements-velo-et-vtt',
      },
    ],
  },
};
