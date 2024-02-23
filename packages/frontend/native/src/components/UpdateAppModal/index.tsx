import React, { useEffect } from 'react';
import Button from '@/components/atoms/Button';
import Modal from '@/components/atoms/Modal';
import { Device } from '@capacitor/device';
import useUpdateApp from '@/hooks/useUpdateApp';

const ModalToggle: React.FC<{ openModal: () => void }> = ({ openModal }) => {
  const { isVisible } = useUpdateApp();

  useEffect(() => {
    if (isVisible) {
      openModal();
    }
  });

  return <></>;
};

const ModalContent: React.FC = () => {
  const { news } = useUpdateApp();

  const redirectToStore = async () => {
    const { platform } = await Device.getInfo();
    const appStoreLink =
      platform === 'android'
        ? 'https://play.google.com/store/apps/details?id=com.barooders'
        : 'https://apps.apple.com/fr/app/barooders-le-sport-doccasion/id6444026059?l=en';

    window.location.href = appStoreLink;
  };

  return (
    <div className="flex max-w-xs flex-col items-center justify-center px-4">
      <p className="text-center text-lg font-bold">Mise à jour disponible</p>
      <div className="mt-5 mb-5">
        {news.length > 0 && (
          <>
            <p className="text-sm font-medium">
              Les améliorations de la nouvelle version :
            </p>
            <ul className="my-3 flex flex-col gap-2">
              {news.map((item: { value: string }, index: number) => {
                return (
                  <li
                    key={index}
                    className="flex gap-2 text-sm"
                  >
                    <span>• </span>
                    <span>{item?.value}</span>
                  </li>
                );
              })}
            </ul>
          </>
        )}
      </div>
      <Button
        intent="primary"
        onClick={redirectToStore}
      >
        Mettre à jour
      </Button>
    </div>
  );
};

const UpdateAppModal = () => {
  return (
    <Modal
      ButtonComponent={ModalToggle}
      ContentComponent={ModalContent}
    />
  );
};

export default UpdateAppModal;
