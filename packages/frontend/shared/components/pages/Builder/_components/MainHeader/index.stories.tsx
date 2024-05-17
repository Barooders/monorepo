import type { Meta, StoryObj } from '@storybook/react';

import { poppins } from '@/document/fonts';
import MainHeader from '.';

const meta: Meta<typeof MainHeader> = {
  title: 'MainHeader',
  component: MainHeader,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-full`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof MainHeader>;

export const Simple: Story = {
  args: {
    mainSlide: {
      image:
        'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/medium_homepage_banner_24f8070168.png',
      link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
    },
    desktopSlides: [
      {
        image:
          'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/medium_homepage_sell_tubike_8755e6da2e.jpeg',
        link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
      },
      {
        image:
          'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/medium_homepage_sell_trek_e55ec5e86a.jpeg',
        link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
      },
    ],
    mobileSlides: [
      {
        image:
          'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_sell_tubike_8755e6da2e.jpeg',
        link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
      },
      {
        image:
          'https://barooders-s3-bucket.s3.eu-west-3.amazonaws.com/public/small_homepage_sell_trek_e55ec5e86a.jpeg',
        link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
      },
    ],
  },
};
