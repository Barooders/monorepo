// Button.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import { poppins } from '@/document/fonts';
import Tabs from '.';

const meta: Meta<typeof Tabs> = {
  title: 'Tabs',
  component: Tabs,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} flex w-6/12`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Tabs>;

export const Simple: Story = {
  args: {
    tabs: [
      {
        label: 'Mes annonces',
        slug: 'onlineProducts',
        content: () => <div>Mes annonces</div>,
      },
      {
        label: 'Mes ventes',
        slug: 'orders',
        content: () => <div>Mes ventes</div>,
      },
    ],
    selectedTab: '',
  },
};
