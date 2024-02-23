import { Disclosure } from '@headlessui/react';
import { FiChevronUp } from 'react-icons/fi';

type PropsType = {
  renderTitle: () => JSX.Element;
  ContentComponent: () => JSX.Element;
  defaultOpen?: boolean;
};

const Collapse: React.FC<PropsType> = ({
  ContentComponent,
  renderTitle,
  defaultOpen = false,
}) => {
  return (
    <div className="mx-auto w-full border-b bg-white py-1">
      <Disclosure defaultOpen={defaultOpen}>
        {({ open }) => (
          <>
            <Disclosure.Button className="text-md flex w-full justify-between py-2 text-left font-bold focus:outline-none focus-visible:ring">
              {renderTitle()}
              <FiChevronUp
                className={`${open ? 'rotate-180 transform' : ''} h-5 w-5`}
              />
            </Disclosure.Button>
            <Disclosure.Panel className="py-2">
              {ContentComponent()}
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    </div>
  );
};

export default Collapse;
