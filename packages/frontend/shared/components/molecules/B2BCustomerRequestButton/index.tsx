import Modal from '@/components/atoms/Modal';
import NoSSR from '@/components/atoms/NoSSR';
import { getDictionary } from '@/i18n/translate';
import { MdOutlineEmail } from 'react-icons/md';
import B2BCustomerRequest from './B2BCustomerRequestForm';

const dict = getDictionary('fr');

const B2BCustomerRequestButton: React.FC = () => {
  return (
    <NoSSR>
      <Modal
        ButtonComponent={({ openModal }) => (
          <div
            onClick={openModal}
            className="flex cursor-pointer items-center justify-center gap-3 rounded-full bg-primary-400 px-5 py-3 text-white"
          >
            <MdOutlineEmail className="text-lg font-semibold" />
            {dict.b2b.proPage.customerRequests.buttonLabel}
          </div>
        )}
        ContentComponent={({ closeModal }) => (
          <B2BCustomerRequest
            onSave={closeModal}
            onClose={closeModal}
          />
        )}
      />
    </NoSSR>
  );
};

export default B2BCustomerRequestButton;
