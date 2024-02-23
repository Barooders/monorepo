import { Url } from '@/types';

type PropsType = {
  name: string | null;
  profilePictureUrl: Url | null;
  className?: string;
};

const Avatar: React.FC<PropsType> = ({
  name,
  profilePictureUrl,
  className,
}) => {
  return profilePictureUrl ? (
    <div
      className={`aspect-square overflow-hidden rounded-full object-cover ${className}`}
    >
      <img
        src={profilePictureUrl}
        alt={name ?? ''}
      />
    </div>
  ) : (
    <div
      className={`flex aspect-square items-center justify-center rounded-full bg-primary-500 text-lg font-semibold uppercase text-white ${className}`}
    >
      {name?.charAt(0)}
    </div>
  );
};

export default Avatar;
