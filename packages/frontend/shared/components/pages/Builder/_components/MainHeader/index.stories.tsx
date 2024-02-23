import type { Meta, StoryObj } from '@storybook/react';

import MainHeader from '.';
import { poppins } from '@/document/fonts';

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
        'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F88f001d9c3964d5389804b5c7e791c62',
      link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
    },
    desktopSlides: [
      {
        image:
          'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fe17a51af3bf64d08ab8e0b71a4503d62',
        link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
      },
      {
        image:
          'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F20c0f2d1e16d409c830b03df45e3d0c4',
        link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
      },
    ],
    mobileSlides: [
      {
        image:
          'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2Fe17a51af3bf64d08ab8e0b71a4503d62',
        link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
      },
      {
        image:
          'https://cdn.builder.io/api/v1/image/assets%2F82c509e50a7e4db197e222880382bb58%2F20c0f2d1e16d409c830b03df45e3d0c4',
        link: 'https://barooders.com/products/vtt-electriques-giant-trance-x-e-2-pro-29',
      },
    ],
  },
};
