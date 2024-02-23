// Button.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import Trustpilot from '.';
import { poppins } from '@/document/fonts';

const meta: Meta<typeof Trustpilot> = {
  title: 'Trustpilot',
  component: Trustpilot,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-full bg-slate-100 p-10`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Trustpilot>;

export const Simple: Story = {
  args: {
    globalRate: 4.5,
    reviewCount: 256,
    reviews: [
      {
        title: 'This was awesome',
        content: 'Really awesome',
        author: 'Steve',
        since: '2023-05-01',
        rate: 5,
      },
      {
        title: 'This was awesome',
        content: 'Really awesome',
        author: 'Steve',
        since: '2023-06-01',
        rate: 4,
      },
      {
        title: 'This was awesome',
        content: 'Really awesome',
        author: 'Steve',
        since: '2023-04-01',
        rate: 2,
      },
      {
        title: 'This was awesome',
        content: 'Really awesome',
        author: 'Steve',
        since: '2023-04-01',
        rate: 2,
      },
    ],
  },
};
