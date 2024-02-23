import { Tab } from '@headlessui/react';
import { useState } from 'react';
import { BsSearch, BsShieldCheck } from 'react-icons/bs';
import { MdOutlineDirectionsBike, MdOutlinePublish } from 'react-icons/md';
import { LiaMoneyCheckAltSolid } from 'react-icons/lia';

export enum AvailableIcons {
  SEARCH = 'SEARCH',
  SHIELD = 'SHIELD',
  BIKE = 'BIKE',
  CYCLE = 'CYCLE',
  CHECK = 'CHECK',
}

type PropsType = {
  tabs: {
    title: string;
    panels: {
      title: string;
      content: string;
      icon: AvailableIcons;
    }[];
  }[];
};

const PanelIcon: React.FC<{ icon: AvailableIcons }> = ({ icon }) => {
  if (icon === AvailableIcons.SEARCH) return <BsSearch />;
  if (icon === AvailableIcons.SHIELD) return <BsShieldCheck />;
  if (icon === AvailableIcons.BIKE) return <MdOutlineDirectionsBike />;
  if (icon === AvailableIcons.CYCLE) return <MdOutlinePublish />;
  if (icon === AvailableIcons.CHECK) return <LiaMoneyCheckAltSolid />;
  return <></>;
};

const PanelsInTabs: React.FC<PropsType> = ({ tabs }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <Tab.Group
      selectedIndex={selectedIndex}
      onChange={setSelectedIndex}
    >
      <div className="mb-3 flex w-full justify-center">
        <Tab.List className="rounded-full bg-slate-100 p-1">
          {tabs.map((tab) => (
            <Tab
              key={tab.title}
              className={({ selected }) =>
                `py-2 px-6 text-xs font-semibold focus:outline-none ${
                  selected ? 'rounded-full bg-white' : ''
                }`
              }
            >
              {tab.title}
            </Tab>
          ))}
        </Tab.List>
      </div>
      <Tab.Panels>
        {tabs.map((tab) => (
          <Tab.Panel key={tab.title}>
            <div className="scrollbar-thin grid grid-cols-1 gap-3 overflow-x-auto md:grid-cols-2 lg:grid-cols-3">
              {tab.panels.map((panel, idx) => (
                <div
                  key={`${panel.title}-${idx}`}
                  className="col-span-1 flex flex-col gap-2 rounded bg-slate-100 py-4 px-5 md:gap-3"
                >
                  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-white pb-1">
                    <div className="absolute -bottom-1 -left-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-100 bg-primary-400 p-1 text-[10px] font-semibold text-white">
                      {idx + 1}
                    </div>
                    <PanelIcon icon={panel.icon} />
                  </div>
                  <p className="text-base font-semibold md:text-xl">
                    {panel.title}
                  </p>
                  <p className="text-sm text-slate-500 md:text-base">
                    {panel.content}
                  </p>
                </div>
              ))}
            </div>
          </Tab.Panel>
        ))}
      </Tab.Panels>
    </Tab.Group>
  );
};

export default PanelsInTabs;
