'use client';

import clsx from 'clsx';
import MegaMenuCard from './MegaMenuCard';
import { MegaMenuItem } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import Link from '@/components/atoms/Link';

type Props = {
  item: MegaMenuItem;
};

const SeeAll = ({ item }: { item: MegaMenuItem }) =>
  item.url !== '#' ? (
    <div className="flex">
      <Link
        className="border-b border-current text-sm font-semibold"
        href={item.url}
        target={item.target ?? undefined}
      >
        Voir tout &quot;
        {item.title}
        &quot;
      </Link>
    </div>
  ) : (
    <></>
  );

const MegaMenuDefaultItemsPanel = ({ item }: Props) => {
  if (!item.children) return <></>;

  return (
    <div className="grid grid-cols-5 gap-2">
      {/* Items */}
      <div className="col-span-3">
        <div className="grid grid-flow-row-dense grid-cols-3">
          {item.children.items.map((childItem, i) => (
            <div
              key={`child_item_${i}`}
              className="col-span-1 pb-3"
            >
              <Link
                className={clsx([
                  `border-b border-transparent text-sm font-semibold`,
                  childItem.url !== '#' && !childItem.children
                    ? `hover:border-current`
                    : 'pointer-events-none',
                ])}
                href={childItem.url}
                target={childItem.target ?? undefined}
              >
                {childItem.title}
              </Link>

              {childItem.children &&
                childItem.children.items.map((grandChildItem, j) => (
                  <div key={`item_${i}_${j}`}>
                    <Link
                      className="border-b border-transparent pt-1 text-xs hover:border-current"
                      href={grandChildItem.url}
                      target={grandChildItem.target ?? undefined}
                    >
                      {grandChildItem.title}
                    </Link>
                  </div>
                ))}

              {childItem.children && <SeeAll item={childItem} />}
            </div>
          ))}
        </div>

        {/* See all */}
        <div className="mt-5">
          <SeeAll item={item} />
        </div>
      </div>

      {/* Cards */}
      {item.children.cards &&
        item.children.cards.length &&
        item.children.cards.map((card, i) => (
          <div
            key={`card_${i}`}
            className="col-span-1"
          >
            <MegaMenuCard card={card} />
          </div>
        ))}
    </div>
  );
};

export default MegaMenuDefaultItemsPanel;
