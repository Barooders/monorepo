import Link from '@/components/atoms/Link';

type PropsType = {
  label: string;
  link?: string;
};

const Tag: React.FC<PropsType> = ({ label, link }) => {
  const baseClassNames =
    'border border-gray-800 bg-white px-2 py-1 text-sm font-medium text-gray-800';

  return link ? (
    <Link
      className={baseClassNames}
      href={link}
    >
      {label}
    </Link>
  ) : (
    <div className={baseClassNames}>{label}</div>
  );
};

export default Tag;
