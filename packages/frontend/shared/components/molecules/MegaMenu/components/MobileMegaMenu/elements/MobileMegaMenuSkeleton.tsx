import Button from '@/components/molecules/MegaMenu/elements/UI/Button';
import {
  ArrowToLeft,
  Close,
} from '@/components/molecules/MegaMenu/elements/UI/Icons';
import {
  IconContainer,
  Icon,
} from '@/components/molecules/MegaMenu/elements/UI/Icon';
import SkeletonDisplayText from '@/components/molecules/MegaMenu/elements/UI/Skeleton';

type Props = {
  isToggled: boolean;
  appearFrom?: 'left' | 'right';
  onGoBack?: () => void;
  onClose?: () => void;
};

const MobileMegaMenuSkeleton = ({
  isToggled,
  appearFrom = 'left',
  onGoBack,
  onClose,
}: Props) => {
  return (
    <div
      className={`fixed inset-0 z-50 flex h-screen w-screen max-w-md flex-col overflow-y-auto overflow-x-hidden bg-white p-4 pb-20 transition-transform duration-300
        ${
          isToggled
            ? 'translate-x-0'
            : appearFrom === 'left'
              ? '-translate-x-full'
              : 'translate-x-full xs:-translate-x-full'
        }`}
    >
      {/* Heading container */}
      <div className="align-center flex justify-center p-0">
        {onGoBack !== undefined && (
          <Button
            className="p-0"
            onClick={onGoBack}
          >
            <IconContainer
              width="18px"
              height="18px"
            >
              <Icon source={ArrowToLeft} />
            </IconContainer>
          </Button>
        )}
        <div className="m-auto flex w-full justify-center text-center text-base font-bold">
          <SkeletonDisplayText />
        </div>
        {onClose !== undefined && (
          <Button
            className="p-0"
            onClick={onClose}
          >
            <IconContainer
              width="14px"
              height="14px"
            >
              <Icon source={Close} />
            </IconContainer>
          </Button>
        )}
      </div>

      {/* Navigation items */}
      <nav role="navigation">
        <ul className="m-0 mt-4 flex flex-col">
          {/* Skeleton items */}
          {[...Array(10)].map((item, i) => (
            <li
              key={`item_${i}`}
              className="relative m-0 flex before:absolute before:top-0 before:left-2/4 before:h-px before:w-screen before:-translate-x-2/4 before:bg-gray-300"
            >
              <span className="flex min-h-[50px] w-full items-center justify-between p-0 text-base">
                <SkeletonDisplayText className="max-w-[20rem]" />
              </span>
            </li>
          ))}

          {[...Array(2)].map((card, i) => (
            <li
              key={`card_${i}`}
              className="relative"
            >
              <span className="mt-4 flex min-h-[125px] w-full rounded-lg bg-gray-100 px-4 py-2"></span>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default MobileMegaMenuSkeleton;
