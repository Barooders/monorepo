import type { Meta, StoryObj } from '@storybook/react';

import Drawer from './portal';
import { poppins } from '@/document/fonts';
import { HiOutlineAdjustmentsHorizontal } from 'react-icons/hi2';

const meta: Meta<typeof Drawer> = {
  title: 'Drawer',
  component: Drawer,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-[380px]`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Drawer>;

export const Filter: Story = {
  args: {
    ContentComponent: () => (
      <div className="min-h-[80vh]">
        <h1 className="text-bold text-xl">Filtres</h1>
        <ul>
          <li>Marques</li>
          <li>Etat</li>
          <li>Vendeur</li>
        </ul>
      </div>
    ),
    ButtonComponent: () => (
      <div className="flex items-center gap-2">
        <HiOutlineAdjustmentsHorizontal />
        Filtres
      </div>
    ),
  },
};
