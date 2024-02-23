type Props = {
  children: React.ReactNode;
};

const Alert: React.FC<Props> = ({ children }) => (
  <div className="rounded-lg border border-red-600 px-3 py-2 text-red-600">
    {children}
  </div>
);

export default Alert;
