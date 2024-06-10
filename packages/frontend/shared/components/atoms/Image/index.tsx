import { Url } from '@/types';
import isEmpty from '@/utils/isEmpty';

type PropsType = {
  src: Url;
  altText: string;
  format: 'thumbnail' | 'medium' | 'large' | 'full';
  className?: string;
  blurred?: boolean;
};

const EXTRACT_EXTENSION_REGEX =
  /(.*)\.(apng|avif|gif|GIF|jfif|jpg|JPG|jpeg|JPEG|pjpeg|pjp|png|PNG|webp|svg)$/;

export const getUrlByFormat = (
  src: PropsType['src'],
  format: PropsType['format'],
) => {
  if (!src.includes('s3.amazonaws.com')) return src;

  const imageUrl = new URL(src);

  const [originalUrl, urlWithoutExtension, extension] =
    EXTRACT_EXTENSION_REGEX.exec(`${imageUrl.origin}${imageUrl.pathname}`) ??
    [];

  if (isEmpty(urlWithoutExtension)) return originalUrl;

  const dimensionModifier = format !== 'full' ? `-${format}` : '';

  return `${urlWithoutExtension}${dimensionModifier}.${extension}`;
};

const Image: React.FC<PropsType> = ({
  src,
  altText,
  format,
  className,
  blurred = false,
}) => {
  console.log(`Not using format ${format}`);
  return (
    <img
      className={`h-full w-full object-contain ${
        blurred ? 'blur-sm' : ''
      } ${className}`}
      alt={altText}
      src={src}
      loading="lazy"
    />
  );
};

export default Image;
