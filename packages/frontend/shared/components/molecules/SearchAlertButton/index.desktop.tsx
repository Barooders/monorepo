import useIsLoggedIn from '@/hooks/useIsLoggedIn';
import { getDictionary } from '@/i18n/translate';
import { FaRegBell } from 'react-icons/fa';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import SearchAlertForm from './SearchAlertForm';

const dict = getDictionary('fr');

const SearchAlertButton: React.FC = () => {
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
          <SearchAlertForm
            onSave={closeModal}
            onClose={closeModal}
          />
        )}
      />
    </NoSSR>
  );
};

export default SearchAlertButton;
