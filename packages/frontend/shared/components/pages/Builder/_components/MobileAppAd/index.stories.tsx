import type { Meta, StoryObj } from '@storybook/react';

import MobileAppAd from '.';
import { poppins } from '@/document/fonts';

const meta: Meta<typeof MobileAppAd> = {
  title: 'MobileAppAd',
  component: MobileAppAd,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-full`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MobileAppAd>;

export const Simple: Story = {
  args: {
    reviews: [
      {
        title: 'Application super simple et intuitive',
        since: '2023-07-01',
        content:
          'J’utilise Barooders depuis longtemps. J’ai vendu plusieurs articles de sport via le site et plus récemment l’appli',
        author: 'Guillaume D.',
      },
      {
        title: 'Application super simple et intuitive',
        since: '2023-07-01',
        content:
          'J’utilise Barooders depuis longtemps. J’ai vendu plusieurs articles de sport via le site et plus récemment l’appli',
        author: 'Guillaume D',
      },
      {
        title: 'Application super simple et intuitive',
        since: '2023-07-01',
        content:
          'J’utilise Barooders depuis longtemps. J’ai vendu plusieurs articles de sport via le site et plus récemment l’appli',
        author: 'Guillaume D.',
      },
    ],
  },
};
