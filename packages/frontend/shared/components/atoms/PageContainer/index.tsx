type Props = {
  children?: React.ReactNode;
  includeVerticalPadding?: boolean;
  size?: 'large' | 'medium' | 'small';
};

const PageContainer: React.FC<Props> = ({
  children,
  includeVerticalPadding = true,
  size = 'large',
}) => (
  <div
    className={`mx-auto ${
      includeVerticalPadding ? 'my-4 mb-8 lg:my-8' : ''
    } flex max-w-page-content px-4`}
  >
    <div
      className={`mx-auto flex w-full flex-col gap-3 ${
        size === 'small'
          ? 'max-w-[500px]'
          : size === 'medium'
          ? 'max-w-[900px]'
          : ''
      }`}
    >
      {children}
    </div>
  </div>
);

export default PageContainer;
