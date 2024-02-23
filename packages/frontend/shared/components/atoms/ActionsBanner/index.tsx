'use client';

type PropsType = {
  children: React.ReactNode;
  title?: string;
};

const ActionsBanner: React.FC<PropsType> = ({ children, title }) => {
  return (
    <div className="fixed top-0 z-50 flex w-full items-center justify-start gap-3 bg-slate-300 bg-opacity-90 p-2">
      {title && <span>{title}:</span>}
      {children}
    </div>
  );
};

export default ActionsBanner;
