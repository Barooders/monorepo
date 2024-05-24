'use client';

import { LineItem, Region } from '@medusajs/medusa';
import { Table, Text, clx } from '@medusajs/ui';

import Link from '@/components/atoms/Link';
import { updateLineItem } from '@/medusa/modules/cart/actions';
import CartItemSelect from '@/medusa/modules/cart/components/cart-item-select';
import ErrorMessage from '@/medusa/modules/checkout/components/error-message';
import DeleteButton from '@/medusa/modules/common/components/delete-button';
import LineItemOptions from '@/medusa/modules/common/components/line-item-options';
import LineItemPrice from '@/medusa/modules/common/components/line-item-price';
import LineItemUnitPrice from '@/medusa/modules/common/components/line-item-unit-price';
import Spinner from '@/medusa/modules/common/icons/spinner';
import { useState } from 'react';
import Thumbnail from '../thumbnail';

type ItemProps = {
  item: Omit<LineItem, 'beforeInsert'>;
  region: Region;
  type?: 'full' | 'preview';
};

const Item = ({ item, region, type = 'full' }: ItemProps) => {
  const [updating, setUpdating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { handle } = item.variant.product;

  const changeQuantity = async (quantity: number) => {
    setError(null);
    setUpdating(true);

    const message = await updateLineItem({
      lineId: item.id,
      quantity,
    })
      .catch((err) => {
        return err.message;
      })
      .finally(() => {
        setUpdating(false);
      });

    message && setError(message);
  };

  return (
    <Table.Row
      className="w-full"
      data-testid="product-row"
    >
      <Table.Cell className="w-24 p-4 !pl-0">
        <Link
          href={`/products/${handle}`}
          className={clx('flex', {
            'w-16': type === 'preview',
            'w-12 small:w-24': type === 'full',
          })}
        >
          <Thumbnail
            thumbnail={item.thumbnail}
            size="square"
          />
        </Link>
      </Table.Cell>

      <Table.Cell className="text-left">
        <Text
          className="txt-medium-plus text-ui-fg-base"
          data-testid="product-title"
        >
          {item.title}
        </Text>
        <LineItemOptions
          variant={item.variant}
          data-testid="product-variant"
        />
      </Table.Cell>

      {type === 'full' && (
        <Table.Cell>
          <div className="flex w-28 items-center gap-2">
            <DeleteButton
              id={item.id}
              data-testid="product-delete-button"
            />
            <CartItemSelect
              value={item.quantity}
              onChange={(value) => changeQuantity(parseInt(value.target.value))}
              className="h-10 w-14 p-4"
              data-testid="product-select-button"
            >
              {Array.from(
                {
                  length: Math.min(
                    item.variant.inventory_quantity > 0
                      ? item.variant.inventory_quantity
                      : 10,
                    10,
                  ),
                },
                (_, i) => (
                  <option
                    value={i + 1}
                    key={i}
                  >
                    {i + 1}
                  </option>
                ),
              )}
            </CartItemSelect>
            {updating && <Spinner />}
          </div>
          <ErrorMessage
            error={error}
            data-testid="product-error-message"
          />
        </Table.Cell>
      )}

      {type === 'full' && (
        <Table.Cell className="hidden small:table-cell">
          <LineItemUnitPrice
            item={item}
            region={region}
            style="tight"
          />
        </Table.Cell>
      )}

      <Table.Cell className="!pr-0">
        <span
          className={clx('!pr-0', {
            'flex h-full flex-col items-end justify-center': type === 'preview',
          })}
        >
          {type === 'preview' && (
            <span className="flex gap-x-1 ">
              <Text className="text-ui-fg-muted">{item.quantity}x </Text>
              <LineItemUnitPrice
                item={item}
                region={region}
                style="tight"
              />
            </span>
          )}
          <LineItemPrice
            item={item}
            region={region}
            style="tight"
          />
        </span>
      </Table.Cell>
    </Table.Row>
  );
};

export default Item;
