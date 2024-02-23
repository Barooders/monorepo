import { Tab } from '@headlessui/react';
import { useEffect, useState } from 'react';

type Tab = {
  label: string;
  slug: string;
  content: () => JSX.Element;
};

type PropsType = {
  tabs: Tab[];
  selectedTab: string;
  className?: string;
};

const getTabIndexFromName = (name: string, tabs: Tab[]) => {
  const tabIndex = tabs.findIndex(({ slug }) => slug === name);
  return tabIndex === -1 ? 0 : tabIndex;
};

const Tabs: React.FC<PropsType> = ({ tabs, selectedTab, className }) => {
  const [selectedIndex, setSelectedIndex] = useState(
    getTabIndexFromName(selectedTab, tabs),
  );

  useEffect(() => {
    setSelectedIndex(getTabIndexFromName(selectedTab, tabs));
  }, [selectedTab]);

  return (
    <div className={`${className ?? ''} w-full`}>
      <Tab.Group
        selectedIndex={selectedIndex}
        onChange={setSelectedIndex}
      >
        <Tab.List className="flex flex-row">
          {tabs.map((tab) => (
            <Tab
              key={tab.slug}
              className={({ selected }) =>
                `p-3 font-semibold uppercase focus:outline-none ${
                  selected
                    ? 'border-b-2 border-gray-800 text-gray-800'
                    : 'text-slate-500'
                }`
              }
            >
              {tab.label}
            </Tab>
          ))}
        </Tab.List>
        <div className="mb-3 border-b-2"></div>
        <Tab.Panels>
          {tabs.map((tab) => (
            <Tab.Panel key={tab.slug}>{tab.content()}</Tab.Panel>
          ))}
        </Tab.Panels>
      </Tab.Group>
    </div>
  );
};
export default Tabs;
