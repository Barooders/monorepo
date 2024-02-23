import { Listbox, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { HiCheck, HiChevronDown } from 'react-icons/hi';

type OptionType = {
  value: string;
  label: string;
};

type PropsType = {
  options: OptionType[];
  onSelect: (value: string) => void;
  selectedOptionValue: string | null;
  className?: string;
  wrapLabels?: boolean;
};

const Select: React.FC<PropsType> = ({
  options,
  onSelect,
  selectedOptionValue,
  className,
  wrapLabels = false,
}) => {
  if (options.length === 0) return <></>;

  const selectedOption =
    options.find((option) => option.value === selectedOptionValue) ??
    options[0];

  return (
    <Listbox
      value={selectedOption.value}
      onChange={onSelect}
    >
      <div className={`${className ?? ''} relative`}>
        <Listbox.Button className="relative w-full cursor-default rounded-lg border border-slate-300 bg-white py-3 pl-3 pr-10 text-left focus:outline-none sm:text-sm">
          <span className="block truncate">{selectedOption.label}</span>
          <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
            <HiChevronDown
              className="h-5 w-5 text-gray-400"
              aria-hidden="true"
            />
          </span>
        </Listbox.Button>
        <Transition
          as={Fragment}
          leave="transition ease-in duration-100"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md border border-slate-300 bg-white py-1 text-base sm:text-sm">
            {options.map((option) => (
              <Listbox.Option
                key={option.value}
                className={({ active }) =>
                  `relative cursor-default select-none py-2 pl-10 pr-4 ${
                    active ? 'bg-red-100 text-red-900' : 'text-gray-900'
                  }`
                }
                value={option.value}
              >
                {({ selected }) => (
                  <>
                    <span
                      className={`block ${wrapLabels ? '' : 'truncate'} ${
                        selected ? 'font-medium' : 'font-normal'
                      }`}
                    >
                      {option.label}
                    </span>
                    {selected ? (
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-red-600">
                        <HiCheck
                          className="h-5 w-5"
                          aria-hidden="true"
                        />
                      </span>
                    ) : null}
                  </>
                )}
              </Listbox.Option>
            ))}
          </Listbox.Options>
        </Transition>
      </div>
    </Listbox>
  );
};

export default Select;
