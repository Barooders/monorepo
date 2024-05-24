import config from '@/config/env';
import { useCallback, useEffect, useState } from 'react';
import { RxDragHandleVertical } from 'react-icons/rx';
import { useRange, useRefinementList } from 'react-instantsearch';
import ReactSlider from 'react-slider';
import { getFacetLabel } from './utils/getFacetLabel';

const SPREAD_POINTS = 25;

const getLargeRange = (range: [number, number]) =>
  [Math.floor(range[0] / 10) * 10, Math.ceil(range[1] / 10) * 10] as [
    number,
    number,
  ];

const RangeFilter = ({
  attribute,
  showSlider = true,
}: {
  attribute: string;
  showSlider?: boolean;
}) => {
  const { items } = useRefinementList({
    attribute,
    limit: config.search.maxValuesPerFacet,
  });
  const { range, refine, start } = useRange({ attribute });

  const getDefaultValues = useCallback(() => {
    const defaultMinValue =
      range.min === undefined
        ? -Infinity
        : start[0] === undefined || start[0] === -Infinity
          ? range.min
          : start[0];
    const defaultMaxValue =
      range.max === undefined
        ? Infinity
        : start[1] === undefined || start[1] === Infinity
          ? range.max
          : start[1];

    return getLargeRange([defaultMinValue, defaultMaxValue]);
  }, [range.max, range.min, start]);

  const getSpreading = useCallback(() => {
    if (!range.max) return [];
    const largeRange = getLargeRange([0, range.max]);
    const spreadStep = (largeRange[1] - largeRange[0] + 1) / SPREAD_POINTS;

    const spreading = items.reduce(
      (steps, item) => {
        const stepNumber = Math.floor(Number(item.value) / spreadStep);
        steps[stepNumber] += item.count;
        return steps;
      },
      Array.from({ length: SPREAD_POINTS }, () => 0),
    );

    const maxSpreadingValue = Math.max(...spreading);

    return spreading.map(
      (item) => Math.round((item / maxSpreadingValue) * 1000) / 1000,
    );
  }, [items, range.max]);

  const [inputState, setInputState] =
    useState<[number, number]>(getDefaultValues());

  const [spreading, setSpreading] = useState<number[]>([]);

  useEffect(() => {
    if (start[0] === -Infinity && start[1] === Infinity) {
      setInputState(getDefaultValues());
    }
  }, [start, getDefaultValues]);

  useEffect(() => {
    setSpreading(getSpreading());
  }, [range.max, items, getSpreading]);

  const triggerUpdate = () =>
    refine([
      Math.max(inputState[0], range.min ?? -Infinity),
      Math.min(inputState[1], range.max ?? Infinity),
    ]);

  return (
    <div className="mb-3 flex flex-col gap-2">
      <p className="text-md font-bold">{getFacetLabel(attribute)}</p>
      {showSlider && (
        <div className="mt-3 w-full px-4 md:px-0">
          <div className="relative flex h-14 w-full items-end gap-[1px]">
            {spreading.map((spreadingItem, i) => (
              <div
                key={i}
                className="flex-grow bg-slate-800"
                style={{ height: `${spreadingItem * 100}%` }}
              />
            ))}
          </div>
          <ReactSlider
            min={0}
            max={range.max}
            className="flex items-center"
            renderTrack={({ key, ...props }, state) => (
              <div
                key={key}
                {...props}
                className={`h-1 ${
                  state.index === 1 ? 'bg-slate-800' : 'bg-slate-300'
                }`}
              />
            )}
            renderThumb={({ key, className, ...props }) => (
              <div
                key={key}
                className={`${className} flex w-0 items-center justify-center outline-0`}
                {...props}
              >
                <div className="flex h-6 w-6 shrink-0 cursor-grab items-center justify-center rounded-full border-2 border-slate-800 bg-white">
                  <RxDragHandleVertical className="font-semibold " />
                </div>
              </div>
            )}
            onChange={(newValue) => {
              if (newValue[1] <= newValue[0]) return;
              setInputState(newValue);
            }}
            onAfterChange={triggerUpdate}
            value={inputState}
            step={10}
          />
        </div>
      )}
      <div className="mt-3 grid grid-cols-2 gap-2">
        <input
          type="number"
          className="flex-shrink rounded border border-slate-300 px-2 py-1"
          value={inputState[0]}
          onBlur={triggerUpdate}
          onChange={(e) =>
            setInputState([Number(e.target.value), inputState[1]])
          }
        />
        <input
          type="number"
          className="flex-shrink rounded border border-slate-300 px-2 py-1"
          value={inputState[1]}
          onBlur={triggerUpdate}
          onChange={(e) =>
            setInputState([inputState[0], Number(e.target.value)])
          }
        />
      </div>
    </div>
  );
};

export default RangeFilter;
