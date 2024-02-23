import React from 'react';
import Link from '@/components/atoms/Link';

export type BreacrumbLinkType = {
  title: string;
  link?: string;
};

type PropsType = {
  elements: BreacrumbLinkType[];
  className?: string;
};

const Breadcrumbs: React.FC<PropsType> = ({ elements, className }) => {
  const breadcrumbElements = [
    { title: 'Barooders', link: '/', handle: 'home' },
    ...elements,
  ].map(({ link, title }, index) => ({
    component: (
      <span
        className={`${index !== elements.length ? 'text-gray-400' : ''}`}
        key={title}
      >
        {link ? <Link href={link}>{title}</Link> : title}
      </span>
    ),
    key: index,
  }));

  const Separator = () => <span className="text-gray-400">{` / `}</span>;

  return (
    <div className={`${className ?? ''} text-xs`}>
      {breadcrumbElements.map(({ component, key }, index) => (
        <React.Fragment key={key}>
          {index !== 0 && <Separator />}
          {component}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Breadcrumbs;
