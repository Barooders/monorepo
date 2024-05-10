import Modal from '@/components/atoms/Modal';
import NoSSR from '@/components/atoms/NoSSR';
import { getDictionary } from '@/i18n/translate';
import { memo } from 'react';
import { MdNotificationsNone } from 'react-icons/md';
import {
  useCurrentRefinements,
  useSearchBox,
} from 'react-instantsearch-hooks-web';
import B2BSavedSearchForm from './B2BSavedSearchForm';

const dict = getDictionary('fr');

const B2BSavedSearchButton: React.FC = () => {
  const { items } = useCurrentRefinements();
  const { query } = useSearchBox();

  if (items.length === 0 && !query) return <></>;

  return (
    <NoSSR>
      <Modal
        ButtonComponent={({ openModal }) => (
          <div
            onClick={openModal}
            className="flex cursor-pointer items-center justify-center gap-3 rounded-full bg-black px-5 py-3 text-white"
          >
            <MdNotificationsNone className="text-lg font-semibold" />
            {dict.b2b.proPage.saveSearch.buttonLabel}
          </div>
        )}
        ContentComponent={({ closeModal }) => (
          <B2BSavedSearchForm
            onSave={closeModal}
            onClose={closeModal}
            currentRefinements={items}
            query={query}
          />
        )}
      />
    </NoSSR>
  );
};

export default memo(B2BSavedSearchButton);
