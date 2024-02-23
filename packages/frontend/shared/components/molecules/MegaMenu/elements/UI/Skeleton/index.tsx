type Props = {
  className?: string;
};

const SkeletonDisplayText = ({ className }: Props) => {
  return (
    <div
      className={`flex h-5 max-w-[7.5rem] flex-grow rounded-md bg-gray-100 ${className}`}
    ></div>
  );
};

export default SkeletonDisplayText;
