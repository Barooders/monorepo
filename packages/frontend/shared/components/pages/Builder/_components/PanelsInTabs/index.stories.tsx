// Button.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import PanelsInTabs, { AvailableIcons } from '.';
import { poppins } from '@/document/fonts';

const meta: Meta<typeof PanelsInTabs> = {
  title: 'PanelsInTabs',
  component: PanelsInTabs,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-full`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof PanelsInTabs>;

export const Simple: Story = {
  args: {
    tabs: [
      {
        title: 'Acheter',
        panels: [
          {
            title: 'Choisissez votre vélo',
            content: 'Choisissez le vélo qui correspond le mieux à vos besoins',
            icon: AvailableIcons.SEARCH,
          },
          {
            title: 'Choisissez votre vélo',
            content: 'Choisissez le vélo qui correspond le mieux à vos besoins',
            icon: AvailableIcons.SHIELD,
          },
          {
            title: 'Choisissez votre vélo',
            content: 'Choisissez le vélo qui correspond le mieux à vos besoins',
            icon: AvailableIcons.BIKE,
          },
        ],
      },
      {
        title: 'Vendre',
        panels: [
          {
            title: 'Choisissez votre vélo',
            content: 'Choisissez le vélo qui correspond le mieux à vos besoins',
            icon: AvailableIcons.SEARCH,
          },
          {
            title: 'Blablabla',
            content: 'Choisissez le vélo qui correspond le mieux à vos besoins',
            icon: AvailableIcons.SEARCH,
          },
          {
            title: 'Choisissez votre vélo',
            content: 'Choisissez le vélo qui correspond le mieux à vos besoins',
            icon: AvailableIcons.SEARCH,
          },
        ],
      },
    ],
  },
};
