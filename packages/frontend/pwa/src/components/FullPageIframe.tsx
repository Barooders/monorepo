import { useLoaderData } from 'react-router-dom';

type LoaderDataType = {
  urlPath: string;
};

const WEBSITE_BASE_URL = `https://${process.env.NEXT_PUBLIC_FRONT_DOMAIN}`;

const FullPageIframe: React.FC = () => {
  const { urlPath } = useLoaderData() as LoaderDataType;

  return (
    <iframe
      className="h-screen w-screen"
      src={`${WEBSITE_BASE_URL}/${urlPath}`}
    />
  );
};

export default FullPageIframe;
