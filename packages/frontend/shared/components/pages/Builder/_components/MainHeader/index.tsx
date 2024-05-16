import Link from '@/components/atoms/Link';
import { getDictionary } from '@/i18n/translate';
import { Url } from '@/types';
import Guarantees from './guarantees';

const dict = getDictionary('fr');

type SlideType = {
  image: Url;
  link: Url;
};

type PropsType = {
  mainSlide: SlideType;
  desktopSlides: SlideType[];
  mobileSlides: SlideType[];
};

const MainHeader: React.FC<PropsType> = ({
  mainSlide,
  desktopSlides,
  mobileSlides,
}) => {
  return (
    <div className="grid w-full gap-5 bg-[#F3F5F7] p-0 pb-5 md:px-5 md:py-5">
      <div className="mx-auto grid max-w-page-content grid-cols-1 gap-3 md:grid-cols-5">
        <Link
          href={mainSlide.link}
          className="col-span-1 w-full overflow-hidden px-1 md:col-span-3 md:rounded-lg md:px-0"
        >
          <img
            className="h-full w-full object-cover"
            src={mainSlide.image}
            alt={dict.homepage.mainSlideAltText}
          />
        </Link>
        <div className="col-span-2 mx-0 hidden flex-col justify-evenly gap-3 md:flex">
          {desktopSlides.map((desktopSlide, idx) => (
            <Link
              key={idx}
              className="grow basis-0 overflow-hidden rounded-lg bg-white"
              href={desktopSlide.link}
            >
              <img
                className="object-cover"
                src={desktopSlide.image}
              />
            </Link>
          ))}
        </div>
        <div className="col-span-1 mx-1 flex justify-evenly gap-1 md:hidden">
          {mobileSlides.map((mobileSlide, idx) => (
            <Link
              key={idx}
              className="grow basis-0 overflow-hidden rounded-lg bg-white"
              href={mobileSlide.link}
            >
              <img
                className="object-cover"
                src={mobileSlide.image}
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="px-5 md:px-0">
        <Guarantees />
      </div>
    </div>
  );
};

export default MainHeader;
