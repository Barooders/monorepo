import { PropsType } from '.';
import { useNavigate } from 'react-router-dom';

const PwaLink: React.FC<PropsType> = ({
  onClick,
  href,
  className,
  title,
  children,
}) => {
  const navigate = useNavigate();
  const navigateOnClick: React.MouseEventHandler = (e) => {
    onClick && onClick(e);
    href && navigate(href);
  };

  return (
    <button
      className={className}
      onClick={navigateOnClick}
      title={title}
    >
      {children}
    </button>
  );
};

export default PwaLink;
