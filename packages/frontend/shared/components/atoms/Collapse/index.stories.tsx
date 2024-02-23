import type { Meta, StoryObj } from '@storybook/react';

import Collapse from '.';
import { poppins } from '@/document/fonts';

const meta: Meta<typeof Collapse> = {
  title: 'Collapse',
  component: Collapse,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-[380px]`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Collapse>;

export const Filter: Story = {
  args: {
    renderTitle: () => <>Marques</>,
    ContentComponent: () => (
      <ul className="flex flex-col gap-2">
        <li>Petzl</li>
        <li>Grivel</li>
      </ul>
    ),
  },
};
