import { Menu, Transition } from '@headlessui/react';
import { Fragment, MouseEventHandler } from 'react';
import { FiChevronDown } from 'react-icons/fi';

type PropsType = {
  className?: string;
  title: string;
  side?: 'right' | 'left';
  options: {
    label: string;
    name: string;
    onClick: MouseEventHandler<HTMLButtonElement>;
  }[];
};

const Dropdown: React.FC<PropsType> = ({
  title,
  options,
  className,
  side = 'left',
}) => {
  return (
    <Menu
      as="div"
      className={`${className} relative z-10 inline-block text-left`}
    >
      <div>
        <Menu.Button className="inline-flex w-full justify-center rounded-md border border-gray-700 bg-opacity-20 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-opacity-75">
          {title}
          <FiChevronDown
            className="ml-2 text-xl text-gray-700"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>
      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items
          className={`absolute ${
            side === 'left' ? 'right' : 'left'
          }-0 mt-2 w-44 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
        >
          <div className="px-1 py-1 ">
            {options.map((option) => (
              <Menu.Item key={option.name}>
                {({ active }) => (
                  <button
                    className={`${
                      active ? 'bg-gray-500 text-white' : 'text-gray-900'
                    } group flex w-full items-center rounded-md px-2 py-2 text-sm`}
                    onClick={option.onClick}
                    name={option.name}
                  >
                    {option.label}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
};

export default Dropdown;
