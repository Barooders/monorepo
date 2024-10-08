import { LineItem, Region } from '@medusajs/medusa';
import { Heading, Table } from '@medusajs/ui';

import Item from '@/medusa/modules/cart/components/item';
import SkeletonLineItem from '@/medusa/modules/skeletons/components/skeleton-line-item';

type ItemsTemplateProps = {
  items?: Omit<LineItem, 'beforeInsert'>[];
  region?: Region;
};

const ItemsTemplate = ({ items, region }: ItemsTemplateProps) => {
  return (
    <div className="medusa">
      <div className="flex items-center pb-3">
        <Heading className="text-[2rem] leading-[2.75rem]">Cart</Heading>
      </div>
      <Table>
        <Table.Header className="border-t-0">
          <Table.Row className="txt-medium-plus text-ui-fg-subtle">
            <Table.HeaderCell className="!pl-0">Item</Table.HeaderCell>
            <Table.HeaderCell></Table.HeaderCell>
            <Table.HeaderCell>Quantity</Table.HeaderCell>
            <Table.HeaderCell className="hidden small:table-cell">
              Price
            </Table.HeaderCell>
            <Table.HeaderCell className="!pr-0 text-right">
              Total
            </Table.HeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
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

export default ItemsTemplate;
