type BlockContentProps = {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
};

const BlockContent: React.FC<BlockContentProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="mt-14 flex flex-col p-0 md:px-5">
      <span className="text-2xl font-medium text-gray-400">{subtitle}</span>
      <h2 className="text-xl font-semibold">{title}</h2>
      {children}
    </div>
  );
};

export default BlockContent;
