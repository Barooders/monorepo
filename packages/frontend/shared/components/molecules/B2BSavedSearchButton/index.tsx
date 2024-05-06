import { SavedSearchContext } from '@/contexts/savedSearch';
import { getDictionary } from '@/i18n/translate';
import { useContext } from 'react';
import { FiSave } from 'react-icons/fi';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import SearchAlertToggleButton from '../SearchAlertToggleButton';
import B2BSavedSearchForm from './B2BSavedSearchForm';

const dict = getDictionary('fr');

const B2BSavedSearchButton: React.FC = () => {
  const existingSavedSearch = useContext(SavedSearchContext);
  // const { items } = useCurrentRefinements();

  // if (items.length === 0) {
  //   return <></>;
  // }

  return (
    <NoSSR>
      <div className="flex gap-2">
        <Modal
          ButtonComponent={({ openModal }) => (
            <Button
              onClick={openModal}
              intent="primary"
              className="text-md shadow-md"
            >
              <div className="flex items-center gap-2">
                <FiSave className="text-white" />
                {dict.b2b.proPage.saveSearch.buttonLabel}
              </div>
            </Button>
          )}
          ContentComponent={({ closeModal }) => (
            <B2BSavedSearchForm
              onSave={closeModal}
              onClose={closeModal}
            />
          )}
        />
        {existingSavedSearch && (
          <SearchAlertToggleButton
            searchId={existingSavedSearch.id}
            isSearchAlertInitiallyActive={
              existingSavedSearch?.SearchAlert?.isActive ?? false
            }
          />
        )}
      </div>
    </NoSSR>
  );
};

export default B2BSavedSearchButton;
