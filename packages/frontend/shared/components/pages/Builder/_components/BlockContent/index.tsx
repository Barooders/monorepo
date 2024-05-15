type BlockContentProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
};

const BlockContent: React.FC<BlockContentProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <div className="mt-14 p-0 md:px-5">
      <div className="mx-auto flex max-w-page-content flex-col">
        {subtitle !== undefined && (
          <span className="text-2xl font-medium text-gray-400">{subtitle}</span>
        )}
        {title !== undefined && (
          <h2 className="mb-3 text-xl font-semibold">{title}</h2>
        )}
        {children}
      </div>
    </div>
  );
};

export default BlockContent;
