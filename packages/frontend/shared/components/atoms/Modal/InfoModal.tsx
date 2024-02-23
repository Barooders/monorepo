import { HiOutlineInformationCircle } from 'react-icons/hi2';
import Modal from '.';

type PropsType = {
  contentComponent: React.ReactNode;
};

const InfoModal: React.FC<PropsType> = ({ contentComponent }) => {
  return (
    <Modal
      ButtonComponent={({ openModal }) => (
        <button
          onClick={(e) => {
            e.preventDefault();
            openModal();
          }}
          className="text-slate-500"
        >
          <HiOutlineInformationCircle />
        </button>
      )}
      ContentComponent={() => <>{contentComponent}</>}
    />
  );
};

export default InfoModal;
