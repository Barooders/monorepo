// Button.stories.ts|tsx

// Replace your-framework with the name of your framework
import type { Meta, StoryObj } from '@storybook/react';

import { poppins } from '@/document/fonts';
import SmallCard from '.';

const meta: Meta<typeof SmallCard> = {
  title: 'SmallCard',
  component: SmallCard,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} flex w-6/12`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof SmallCard>;

export const Simple: Story = {
  args: {
    title: "Titre de l'annonce",
    tag: 'En ligne',
    description: '2023 - Très bon état',
    price: '1234,00€',
    imageSrc: 'https://placehold.co/78x48/orange/white',
    link: 'https://barooders.com/product/tente-de-randonnee-msr-elixir-2-gris',
  },
};
