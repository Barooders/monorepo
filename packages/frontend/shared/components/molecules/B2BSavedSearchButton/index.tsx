import { SavedSearchContext } from '@/contexts/savedSearch';
import useUpdateSavedSearch from '@/hooks/useUpdateSavedSearch';
import { getDictionary } from '@/i18n/translate';
import { useContext, useState } from 'react';
import { FiSave } from 'react-icons/fi';
import { IoMdNotifications, IoMdNotificationsOff } from 'react-icons/io';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import B2BSavedSearchForm from './B2BSavedSearchForm';

const dict = getDictionary('fr');

const B2BSavedSearchButton: React.FC = () => {
  const existingSavedSearch = useContext(SavedSearchContext);
  const [, updateSavedSearch] = useUpdateSavedSearch();
  const [isSearchAlertActive, setIsSearchAlertActive] = useState<boolean>(
    existingSavedSearch?.SearchAlert?.isActive ?? false,
  );

  const toggleSearchAlert = async () => {
    if (!existingSavedSearch) return;
    const shouldTriggerAlerts = !isSearchAlertActive;

    await updateSavedSearch(existingSavedSearch?.id, {
      shouldTriggerAlerts,
    });
    setIsSearchAlertActive(shouldTriggerAlerts);
  };

  return (
    <NoSSR>
      <div className="flex gap-2">
        <Modal
          ButtonComponent={({ openModal }) => (
            <Button
              onClick={openModal}
              intent="primary"
              className="text-md w-full shadow-md"
            >
              <div className="flex items-center justify-center gap-2">
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
          <Button
            onClick={toggleSearchAlert}
            intent={isSearchAlertActive ? 'primary' : 'discrete'}
            className="text-md w-full shadow-md"
          >
            <div className="flex items-center justify-center gap-2">
              {isSearchAlertActive ? (
                <IoMdNotifications className="text-white" />
              ) : (
                <IoMdNotificationsOff className="text-black" />
              )}
            </div>
          </Button>
        )}
      </div>
    </NoSSR>
  );
};

export default B2BSavedSearchButton;
