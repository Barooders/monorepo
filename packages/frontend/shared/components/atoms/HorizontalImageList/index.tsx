import { Url } from '@/types';
import Link from '@/components/atoms/Link';
import HorizontalScroller from '../HorizontalScroller';

type ImageItem = {
  pictureUrl: Url;
  title: string;
  link: Url;
};

type PropsType = {
  items: ImageItem[];
};

const HorizontalImageList: React.FC<PropsType> = ({ items }) => {
  return (
    <HorizontalScroller>
      {items.map((item) => (
        <Link
          href={item.link}
          key={`${item.title}-${item.link}`}
          className="flex w-24 flex-shrink-0 cursor-pointer flex-col items-center gap-2"
        >
          <img
            className="h-20 w-20 overflow-hidden rounded-full shadow"
            src={item.pictureUrl}
          />
          <p className="text-center text-xs font-semibold">{item.title}</p>
        </Link>
      ))}
    </HorizontalScroller>
  );
};

export default HorizontalImageList;
