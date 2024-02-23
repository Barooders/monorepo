import { INNER_PAGE_BANNER_ANCHOR } from '@/config';
import { getDictionary } from '@/i18n/translate';
import { useKeenSlider } from 'keen-slider/react';
import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FaChevronRight } from 'react-icons/fa';
import Link from '../Link';

const dict = getDictionary('fr');

type BannerMessage = {
  label: string;
  icon?: React.ReactNode;
  link?: string;
};

const bannerMessages: BannerMessage[] = [
  {
    label: 'Marque de la semaine - CUBE - jusqu’à -50%',
    icon: '🚴‍♀️',
    link: 'https://barooders.com/collections/cube',
  },
  {
    label: '️Vendeur de la semaine - CyclesY - jusqu’à -60%',
    icon: '⭐️',
    link: 'https://barooders.com/collections/vendors?q=CyclesY',
  },
];

const AUTO_PLAY_TIME = 4000;

const InnerPageBanner = () => {
  const [innerPageAnchor, setInnerPageAnchor] = useState<HTMLElement | null>(
    null,
  );

  const [sliderRef] = useKeenSlider<HTMLDivElement>(
    {
      loop: true,
    },
    [
      (slider) => {
        let timeout: string | number | NodeJS.Timeout | undefined;
        let mouseOver = false;
        function clearNextTimeout() {
          clearTimeout(timeout);
        }
        function nextTimeout() {
          clearTimeout(timeout);
          if (mouseOver) return;
          timeout = setTimeout(() => {
            slider.next();
          }, AUTO_PLAY_TIME);
        }
        slider.on('created', () => {
          slider.container.addEventListener('mouseover', () => {
            mouseOver = true;
            clearNextTimeout();
          });
          slider.container.addEventListener('mouseout', () => {
            mouseOver = false;
            nextTimeout();
          });
          nextTimeout();
        });
        slider.on('dragStarted', clearNextTimeout);
        slider.on('animationEnded', nextTimeout);
        slider.on('updated', nextTimeout);
      },
    ],
  );

  useEffect(() => {
    setInnerPageAnchor(document.getElementById(INNER_PAGE_BANNER_ANCHOR));
  }, []);

  return (
    innerPageAnchor &&
    createPortal(
      bannerMessages.length > 0 ? (
        <div className="relative w-full overflow-visible lg:h-9">
          <div
            ref={sliderRef}
            className="keen-slider absolute bg-blue-200 py-2 text-sm"
          >
            {bannerMessages.map((bannerMessage, idx) => (
              <div
                key={idx}
                className="keen-slider__slide flex items-center justify-center gap-3 px-3 font-semibold"
              >
                <span>{bannerMessage.icon && bannerMessage.icon}</span>{' '}
                <span className="truncate">{bannerMessage.label}</span>
                {bannerMessage.link && (
                  <Link
                    className="flex shrink-0 items-center gap-1 underline"
                    href={bannerMessage.link}
                  >
                    {dict.search.innerPageBanner.moreDetails}
                    <FaChevronRight className="text-xs" />
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <></>
      ),
      innerPageAnchor,
    )
  );
};

export default InnerPageBanner;
