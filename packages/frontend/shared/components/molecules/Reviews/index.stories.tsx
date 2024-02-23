import type { Meta, StoryObj } from '@storybook/react';

import Reviews from '.';
import { poppins } from '@/document/fonts';

const meta: Meta<typeof Reviews> = {
  title: 'Reviews',
  component: Reviews,
  decorators: [
    (Story) => (
      <div className={`${poppins.className} w-[500px]`}>
        <Story />
      </div>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof Reviews>;

export const Simple: Story = {
  args: {
    reviews: [
      {
        authorNickname: null,
        author: {
          createdAt: '2022-01-01',
          name: 'Nicolas',
          profilePictureUrl:
            'https://media.licdn.com/dms/image/D4E03AQFge-Zs6yHd9Q/profile-displayphoto-shrink_800_800/0/1683011178267?e=2147483647&v=beta&t=u0hnTBxEIo-7kbeZmEd3wKW76qrSGtJ1IGReutC0iqE',
        },
        content: "C'est arrivé vite et bien emballé, aucun soucis",
        title: 'Super vélo !!!!!',
        id: 'f20e7bf7-66f9-4e1e-a710-ac524282e72a',
        createdAt: '2023-08-29',
        rating: 5,
      },
      {
        authorNickname: null,
        author: {
          createdAt: '2021-02-03',
          name: 'JPDS',
          profilePictureUrl: null,
        },
        content:
          "C'était presque nickel, mais je met 4 pour tester que la note marche bien",
        title: 'Pas mal',
        id: 'f20e7bf7-66f8-4a1e-a710-ac524282a908',
        createdAt: '2023-07-28',
        rating: 4,
      },
      {
        authorNickname: null,
        author: {
          createdAt: '2021-02-03',
          name: 'JPDS',
          profilePictureUrl: null,
        },
        content:
          "C'était presque nickel, mais je met 4 pour tester que la note marche bien",
        title: 'Pas mal',
        id: 'f20e7bf7-66f8-4a1e-a710-ac524282a908',
        createdAt: '2023-07-28',
        rating: 4,
      },
      {
        authorNickname: null,
        author: {
          createdAt: '2021-02-03',
          name: 'JPDS',
          profilePictureUrl: null,
        },
        content:
          "C'était presque nickel, mais je met 4 pour tester que la note marche bien",
        title: 'Pas mal',
        id: 'f20e7bf7-66f8-4a1e-a710-ac524282a908',
        createdAt: '2023-07-28',
        rating: 4,
      },
      {
        authorNickname: null,
        author: {
          createdAt: '2021-02-03',
          name: 'JPDS',
          profilePictureUrl: null,
        },
        content:
          "C'était presque nickel, mais je met 4 pour tester que la note marche bien",
        title: 'Pas mal',
        id: 'f20e7bf7-66f8-4a1e-a710-ac524282a908',
        createdAt: '2023-07-28',
        rating: 4,
      },
    ],
  },
};
