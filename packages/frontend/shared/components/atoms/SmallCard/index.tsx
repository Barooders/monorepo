import Link from '../Link';

/* eslint-disable @next/next/no-img-element */
type PropsType = {
  className?: string;
  title?: string | null;
  tag: string | null;
  description: string;
  imageSrc: string | null;
  link?: string;
  price?: string;
};

const SmallCard: React.FC<PropsType> = ({
  className,
  title,
  tag,
  description,
  link,
  price,
  imageSrc,
}) => {
  const cardContent = (
    <>
      {imageSrc ? (
        <img
          src={imageSrc}
          alt={title ?? ''}
          className="h-[48px] w-[78px] rounded object-contain"
        />
      ) : (
        <div className="h-[48px] w-[78px] rounded bg-gray-200" />
      )}
      <div className="ml-3 flex-1">
        <p className="text-gray-800">
          {title && (
            <span className="text-sm font-semibold uppercase">{title}</span>
          )}
          {tag && (
            <span className="ml-2 rounded-md bg-gray-100 p-1 text-xs">
              {tag}
            </span>
          )}
        </p>
        <p className="mt-1 text-xs text-gray-600">{description}</p>
        {price && <p className="text-sm text-gray-800">{price}</p>}
      </div>
    </>
  );
  return link ? (
    <Link
      className={`${className ?? ''} flex flex-row items-center`}
      href={link}
    >
      {cardContent}
    </Link>
  ) : (
    <div className={`${className ?? ''} flex flex-row items-center`}>
      {cardContent}
    </div>
  );
};
export default SmallCard;
