'use client';

import { LineItem, Region } from '@medusajs/medusa';
import { Table, clx } from '@medusajs/ui';

import Item from '@/medusa/modules/cart/components/item';
import SkeletonLineItem from '@/medusa/modules/skeletons/components/skeleton-line-item';

type ItemsTemplateProps = {
  items?: Omit<LineItem, 'beforeInsert'>[];
  region?: Region;
};

const ItemsPreviewTemplate = ({ items, region }: ItemsTemplateProps) => {
  const hasOverflow = items && items.length > 4;

  return (
    <div
      className={clx({
        'medusa no-scrollbar max-h-[420px] overflow-x-hidden overflow-y-scroll pl-[1px]':
          hasOverflow,
      })}
    >
      <Table>
        <Table.Body data-testid="items-table">
          {items && region
            ? items
                .sort((a, b) => {
                  return a.created_at > b.created_at ? -1 : 1;
                })
                .map((item) => {
                  return (
                    <Item
                      key={item.id}
                      item={item}
                      region={region}
                      type="preview"
                    />
                  );
                })
            : Array.from(Array(5).keys()).map((i) => {
                return <SkeletonLineItem key={i} />;
              })}
        </Table.Body>
      </Table>
    </div>
  );
};

export default ItemsPreviewTemplate;
