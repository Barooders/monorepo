import dynamic from 'next/dynamic';

type Props = {
  children?: React.ReactNode;
};

const NoSsr: React.FC<Props> = ({ children }) => <>{children}</>;

export default dynamic(() => Promise.resolve(NoSsr), {
  ssr: false,
});
