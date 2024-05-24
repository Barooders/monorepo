/* eslint-disable @typescript-eslint/no-explicit-any */
import { EllipseMiniSolid } from '@medusajs/icons';
import { Label, RadioGroup, Text, clx } from '@medusajs/ui';
import { ChangeEvent } from 'react';

type FilterRadioGroupProps = {
  title: string;
  items: {
    value: string;
    label: string;
  }[];
  value: any;
  handleChange: (...args: any[]) => void;
  'data-testid'?: string;
};

const FilterRadioGroup = ({
  title,
  items,
  value,
  handleChange,
  'data-testid': dataTestId,
}: FilterRadioGroupProps) => {
  return (
    <div className="flex flex-col gap-x-3 gap-y-3">
      <Text className="txt-compact-small-plus text-ui-fg-muted">{title}</Text>
      <RadioGroup data-testid={dataTestId}>
        {items?.map((i) => (
          <div
            key={i.value}
            className={clx('flex items-center gap-x-2', {
              'ml-[-1.75rem]': i.value === value,
            })}
          >
            {i.value === value && <EllipseMiniSolid />}
            <RadioGroup.Item
              checked={i.value === value}
              onClick={(e) =>
                handleChange(
                  e as unknown as ChangeEvent<HTMLButtonElement>,
                  i.value,
                )
              }
              className="peer hidden"
              id={i.value}
              value={i.value}
            />
            <Label
              htmlFor={i.value}
              className={clx(
                '!txt-compact-small text-ui-fg-subtle !transform-none hover:cursor-pointer',
                {
                  'text-ui-fg-base': i.value === value,
                },
              )}
              data-testid="radio-label"
              data-active={i.value === value}
            >
              {i.label}
            </Label>
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterRadioGroup;
