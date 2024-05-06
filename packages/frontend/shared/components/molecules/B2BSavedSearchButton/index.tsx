import { getDictionary } from '@/i18n/translate';
import { memo } from 'react';
import {
  useCurrentRefinements,
  useSearchBox,
} from 'react-instantsearch-hooks-web';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import B2BSavedSearchForm from './B2BSavedSearchForm';

const dict = getDictionary('fr');

const B2BSavedSearchButton: React.FC = () => {
  const { items } = useCurrentRefinements();
  const { query } = useSearchBox();

  return (
    <NoSSR>
      <Modal
        ButtonComponent={({ openModal }) => (
          <Button
            onClick={openModal}
            intent="secondary"
            className="text-md w-full shadow-md"
          >
            <div className="items-center">
              {dict.b2b.proPage.saveSearch.buttonLabel}
            </div>
          </Button>
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
