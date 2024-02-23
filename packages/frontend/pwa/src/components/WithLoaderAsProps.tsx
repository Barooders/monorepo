import { useLoaderData } from 'react-router-dom';

function WithLoaderDataAsProps<PropsType>(
  Component: React.FC<PropsType>,
): React.FC {
  const WrappedComponent = () => {
    const loaderData = useLoaderData() as PropsType & JSX.IntrinsicAttributes;
    return <Component {...loaderData} />;
  };

  return WrappedComponent;
}

export default WithLoaderDataAsProps;
