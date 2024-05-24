import Link from '@/components/atoms/Link';
import { ArrowUpRightMini } from '@medusajs/icons';
import { Text } from '@medusajs/ui';

type InteractiveLinkProps = {
  href: string;
  children?: React.ReactNode;
  onClick?: () => void;
};

const InteractiveLink = ({
  href,
  children,
  onClick,
  ...props
}: InteractiveLinkProps) => {
  return (
    <Link
      className="group flex items-center gap-x-1"
      href={href}
      onClick={onClick}
      {...props}
    >
      <Text className="text-ui-fg-interactive">{children}</Text>
      <ArrowUpRightMini
        className="duration-150 ease-in-out group-hover:rotate-45"
        color="var(--fg-interactive)"
      />
    </Link>
  );
};

export default InteractiveLink;
