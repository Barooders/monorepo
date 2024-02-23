import { Url } from '@/types';

type PropsType = {
  src: Url;
  altText: string;
  format: 'thumbnail' | 'medium' | 'large' | 'full';
  className?: string;
  blurred?: boolean;
};

const EXTRACT_EXTENSION_REGEX =
  /(.*)\.(apng|avif|gif|GIF|jfif|jpg|JPG|jpeg|JPEG|pjpeg|pjp|png|PNG|webp|svg)$/;
const formatToDimension = {
  thumbnail: 300,
  medium: 800,
  large: 1200,
  full: Infinity,
};

export const getUrlByFormat = (
  src: PropsType['src'],
  format: PropsType['format'],
) => {
  if (!src.includes('cdn.shopify.com')) return src;

  const imageUrl = new URL(src);

  const [originalUrl, urlWithoutExtension, extension] =
    EXTRACT_EXTENSION_REGEX.exec(`${imageUrl.origin}${imageUrl.pathname}`) ??
    [];

  if (!urlWithoutExtension) return originalUrl;

  const dimension = formatToDimension[format];
  const dimensionModifier =
    dimension !== Infinity ? `_${dimension}x${dimension}` : '';

  return `${urlWithoutExtension}${dimensionModifier}.${extension}`;
};

const Image: React.FC<PropsType> = ({
  src,
  altText,
  format,
  className,
  blurred = false,
}) => {
  return (
    <img
      className={`h-full w-full object-contain ${
        blurred ? 'blur-sm' : ''
      } ${className}`}
      alt={altText}
      src={getUrlByFormat(src, format)}
    />
  );
};

export default Image;
