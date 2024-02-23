'use client';

import { MegaMenuItem } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { useState } from 'react';
import MegaMenuPanelContent from './MegaMenuPanelContent';

type Props = {
  items: MegaMenuItem[];
};

const MegaMenuBackbone: React.FC<Props> = ({ items }) => {
  const [selectedItem, setSelectedItem] = useState(items[0]);
  return (
    <div className="flex">
      <ul className="mr-5 flex w-48 flex-shrink-0 flex-col overflow-y-auto border-r">
        {items.map((item) => (
          <li
            key={item.id}
            className="w-full py-2 text-sm font-semibold hover:cursor-pointer hover:underline"
            onClick={() => setSelectedItem(item)}
          >
            {item.title}
          </li>
        ))}
      </ul>
      <div className="flex-grow">
        <MegaMenuPanelContent item={selectedItem} />
      </div>
    </div>
  );
};

export default MegaMenuBackbone;
