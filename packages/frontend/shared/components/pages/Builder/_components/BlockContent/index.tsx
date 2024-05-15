import Button from '@/components/atoms/Button';

type BlockContentProps = {
  title?: string;
  subtitle?: string;
  children: React.ReactNode;
  button?: {
    label: string;
    link: string;
  };
};

const BlockContent: React.FC<BlockContentProps> = ({
  children,
  title,
  subtitle,
  button,
}) => {
  return (
    <div className="mt-14 p-0 md:px-5">
      <div className="mx-auto flex max-w-page-content flex-col">
        <div className="flex justify-between">
          <div>
            {subtitle !== undefined && (
              <span className="text-2xl font-medium text-gray-400">
                {subtitle}
              </span>
            )}
            {title !== undefined && (
              <h2 className="mb-3 text-xl font-semibold">{title}</h2>
            )}
          </div>
          {button !== undefined ? (
            <Button
              intent="discrete"
              href={button.link}
              className="h-fit w-fit bg-gray-200 text-gray-500"
              size="small"
            >
              {button.label}
            </Button>
          ) : (
            <></>
          )}
        </div>

        {children}
      </div>
    </div>
  );
};

export default BlockContent;
