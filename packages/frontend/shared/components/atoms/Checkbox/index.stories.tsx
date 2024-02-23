// Button.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import Checkbox from '.';
import { poppins } from '@/document/fonts';

const meta: Meta<typeof Checkbox> = {
  title: 'Checkbox',
  component: Checkbox,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-[380px]`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Checkbox>;

export const Simple: Story = {
  args: {
    label: 'Gravel',
  },
};
