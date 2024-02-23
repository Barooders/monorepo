import { Url } from '@/types';
import dynamic from 'next/dynamic';

const DynamicPwaLink = dynamic(() => import('./PwaLink'));

export type PropsType = {
  children: React.ReactNode;
  className?: string;
  onClick?: React.MouseEventHandler;
  target?: string;
  href?: Url;
  title?: string;
  rel?: string;
};

// TODO: We disable Next links for now to take advantage on Cloudflare page caching

const Link: React.FC<PropsType> = (props) => {
  const { children, className, href, onClick, target, title, rel } = props;
  if (!href) {
    return (
      <button
        className={className}
        onClick={onClick}
        title={title}
      >
        {children}
      </button>
    );
  }

  const shouldUseInternalRouter = process.env.NEXT_PUBLIC_BUILD_NAME === 'pwa';
  if (shouldUseInternalRouter) {
    return <DynamicPwaLink {...props} />;
  }

  return (
    <a
      className={`${className} cursor-pointer`}
      href={href}
      onClick={onClick}
      target={target}
      title={title}
      rel={rel}
    >
      {children}
    </a>
  );
};

export default Link;
