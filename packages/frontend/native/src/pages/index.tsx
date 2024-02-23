import Button from '@/components/atoms/Button';

const AppIsInProgress: React.FC = () => {
  return (
    <div className="fixed top-0 bottom-0 right-0 left-0 flex flex-col items-center justify-center gap-5 p-10 text-center">
      <div className="mb-1 text-2xl font-semibold">
        L&apos;application mobile est en chantier... 👷🚴
      </div>
      <div>...mais pas le site web !</div>
      <Button
        intent="primary"
        href="https://barooders.com"
      >
        Ouvrir Barooders.com
      </Button>
    </div>
  );
};

export default AppIsInProgress;
