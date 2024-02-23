type Props = {
  children?: React.ReactNode;
  title?: string;
};

const FooterSection: React.FC<Props> = ({ title, children }) => (
  <div className="flex-grow basis-1/2 text-sm lg:max-w-[210px] lg:basis-1/4">
    <div className="mb-4 font-semibold">{title}</div>
    {children}
  </div>
);

export default FooterSection;
