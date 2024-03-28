import { getDictionary } from '@/i18n/translate';
import { FiSave } from 'react-icons/fi';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import B2BSavedSearchForm from './B2BSavedSearchForm';

const dict = getDictionary('fr');

const B2BSavedSearchButton: React.FC = () => {
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
    </NoSSR>
  );
};

export default B2BSavedSearchButton;
