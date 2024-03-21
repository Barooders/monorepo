import { getDictionary } from '@/i18n/translate';
import { FaRegBell } from 'react-icons/fa';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import B2BSearchAlertForm from './B2BSearchAlertForm';

const dict = getDictionary('fr');

const B2BSearchAlertButton: React.FC = () => {
  return (
    <NoSSR>
      <Modal
        ButtonComponent={({ openModal }) => (
          <Button
            onClick={openModal}
            intent="primary"
            className="text-md w-full shadow-md"
          >
            <div className="flex items-center justify-center gap-2">
              <FaRegBell className="text-white" />
              {dict.b2b.proPage.saveSearch.buttonLabel}
            </div>
          </Button>
        )}
        ContentComponent={({ closeModal }) => (
          <B2BSearchAlertForm
            onSave={closeModal}
            onClose={closeModal}
          />
        )}
      />
    </NoSSR>
  );
};

export default B2BSearchAlertButton;
