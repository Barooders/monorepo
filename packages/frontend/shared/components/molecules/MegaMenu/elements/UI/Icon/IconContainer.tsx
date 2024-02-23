import clsx from 'clsx';

import styles from './IconContainer.module.scss';

type Props = {
  children?: React.ReactNode;
  width?: string;
  height?: string;
  className?: string;
};

const IconContainer = ({ children, width, height, className }: Props) => {
  const dimensions: { [key: string]: string } = {};

  if (width) dimensions['--icon-container-width'] = width;

  if (height) dimensions['--icon-container-height'] = height;

  return (
    <i
      className={clsx([styles['IconContainer'], className])}
      style={dimensions}
    >
      {children}
    </i>
  );
};

export default IconContainer;
