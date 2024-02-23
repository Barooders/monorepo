/* eslint-disable @next/next/no-img-element */
type PropsType = {
  className?: string;
  title: string;
  subtitle: string;
  imageSrc: string;
  children?: React.ReactNode;
};

const ContactCard: React.FC<PropsType> = ({
  title,
  subtitle,
  imageSrc,
  children,
  className,
}) => {
  return (
    <div
      className={`${className} flex flex-col items-center rounded-lg border border-zinc-200 p-4`}
    >
      <img
        src={imageSrc}
        className="mb-3 hidden h-[56px] w-[56px] rounded-full object-cover sm:block"
        alt={title}
      />
      <p>{title}</p>
      <p className="text-sm text-gray-600">{subtitle}</p>
      {children}
    </div>
  );
};
export default ContactCard;
