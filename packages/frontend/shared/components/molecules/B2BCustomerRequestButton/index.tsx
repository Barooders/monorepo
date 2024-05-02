import { getDictionary } from '@/i18n/translate';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import B2BCustomerRequest from './B2BCustomerRequestForm';

const dict = getDictionary('fr');

const B2BCustomerRequestButton: React.FC = () => {
  return (
    <NoSSR>
      <div className="flex gap-2">
        <Modal
          ButtonComponent={({ openModal }) => (
            <Button
              onClick={openModal}
              intent="secondary"
              className="text-md w-full shadow-md"
            >
              <div className="flex items-center justify-center gap-2">
                {dict.b2b.proPage.customerRequests.buttonLabel}
              </div>
            </Button>
          )}
          ContentComponent={({ closeModal }) => (
            <B2BCustomerRequest
              onSave={closeModal}
              onClose={closeModal}
            />
          )}
        />
      </div>
    </NoSSR>
  );
};

export default B2BCustomerRequestButton;
