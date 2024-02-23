import Loader from '@/components/atoms/Loader';

type PropsType = {
  iframeUrl: string;
};

const FullPageIframe: React.FC<PropsType> = ({ iframeUrl }) => (
  <div className="absolute top-0 right-0 left-0 bottom-0 flex items-center justify-center">
    <Loader className="absolute z-0 h-7 w-7" />
    <iframe
      src={iframeUrl}
      className="absolute z-10 h-full w-full"
    />
  </div>
);

export default FullPageIframe;
