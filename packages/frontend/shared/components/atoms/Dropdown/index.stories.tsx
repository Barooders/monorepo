// Button.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import Dropdown from '.';
import { poppins } from '@/document/fonts';

const meta: Meta<typeof Dropdown> = {
  title: 'Dropdown',
  component: Dropdown,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} flex w-full justify-center`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Dropdown>;

export const Simple: Story = {
  args: {
    title: 'Trier par',
    options: [
      { label: 'Les plus pertinents', onClick: console.log, name: 'relevance' },
      { label: 'Les plus récents', onClick: console.log, name: 'recent' },
      { label: 'Les moins chers', onClick: console.log, name: 'cheap' },
    ],
  },
};
