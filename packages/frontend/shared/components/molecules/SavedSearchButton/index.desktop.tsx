import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import { FaRegBell } from 'react-icons/fa';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import SavedSearchForm from './SavedSearchForm';

const dict = getDictionary('fr');

const SavedSearchButton: React.FC = () => {
  const { needsLogin } = useIsLoggedIn();

  return (
    <NoSSR>
      <Modal
        ButtonComponent={({ openModal }) => (
          <Button
            onClick={needsLogin(openModal)}
            intent="primary"
            className="text-md shadow-md"
          >
            <div className="flex items-center gap-2">
              <FaRegBell className="text-white" />
              {dict.searchAlerts.buttonLabel}
            </div>
          </Button>
        )}
        ContentComponent={({ closeModal }) => (
          <SavedSearchForm
            onSave={closeModal}
            onClose={closeModal}
          />
        )}
      />
    </NoSSR>
  );
};

export default SavedSearchButton;
