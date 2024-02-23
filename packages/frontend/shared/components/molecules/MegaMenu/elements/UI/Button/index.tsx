import clsx from 'clsx';

import { capitalize } from '@/components/molecules/MegaMenu/shared/helpers/utils.helper';

import styles from './Button.module.scss';

type ButtonVariant = 'primary';

type Props = {
  children?: React.ReactNode;
  variant?: ButtonVariant;
  className?: string;
  url?: string;
  isDisabled?: boolean;
  isInactive?: boolean;
  onClick?: () => unknown;
  target?: string;
  hasIconOnly?: boolean;
};

const Button = ({
  children,
  variant,
  className,
  isInactive,
  isDisabled,
  onClick,
  url,
  target,
  hasIconOnly,
}: Props) => {
  const ButtonTag = url ? 'a' : ('button' as keyof JSX.IntrinsicElements);

  const modifiersArr: string[] = [];

  if (variant)
    modifiersArr.push(
      styles[`Button--variant${capitalize(variant.toString())}`],
    );

  return (
    // eslint-disable-next-line
    // @ts-ignore
    <ButtonTag
      className={clsx([
        styles['Button'],
        modifiersArr.join(' '),
        className,
        hasIconOnly &&
          `
                    h-10
                    w-10
                    rounded-full
                    bg-gray-900
                    p-0
                    text-white

                    [&>*]:fill-current
                `,
      ])}
      href={isInactive || isDisabled ? undefined : url}
      target={target}
      onClick={isInactive || isDisabled ? () => null : onClick}
      disabled={isDisabled}
    >
      {children}
    </ButtonTag>
  );
};

export default Button;
