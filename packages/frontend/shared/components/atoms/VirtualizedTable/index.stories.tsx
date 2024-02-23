// Button.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import { poppins } from '@/document/fonts';
import VirtualizedTable from '.';

const meta: Meta<typeof VirtualizedTable> = {
  title: 'VirtualizedTable',
  component: VirtualizedTable,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-full`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof VirtualizedTable>;

export const Simple: Story = {
  args: {
    width: 500,
    desktopRowHeight: 60,
    mobileRowHeight: 120,
    rows: [
      { name: 'Brian Vaughn', description: 'Software engineer' },
      { name: 'Michel', description: 'Plombier' },
      { name: 'Sophie', description: 'CEO' },
      { name: 'N4', description: 'J4' },
      { name: 'N5', description: 'J5' },
      { name: 'N6', description: <div>Works with a div</div> },
    ],
    columns: {
      desktopColumns: {
        name: { width: 200, label: 'Nom' },
        description: { width: 300, label: 'Description' },
      },
      highlightedMobileColumns: ['description'],
    },
  },
};
