import NoSSR from '@/components/atoms/NoSSR';
import SocialIcons from '@/components/molecules/SocialIcons';
import { getDictionary } from '@/i18n/translate';
import { Libre_Franklin } from 'next/font/google';
import { marked } from 'marked';

const libreFranklin = Libre_Franklin({
  weight: ['500'],
  style: ['normal'],
  subsets: ['latin'],
  display: 'swap',
});

const AnnouncementBar = () => {
  const dictionnary = getDictionary('fr');
  return (
    <div className="hidden h-9 w-full bg-secondary-900 text-white lg:block">
      <div className="mx-auto flex h-full max-w-page-content items-center px-10">
        <div className="flex flex-grow justify-center text-sm">
          <NoSSR>
            <div
              className={`${libreFranklin.className}`}
              dangerouslySetInnerHTML={{
                __html: marked.parse(dictionnary.header.announcement),
              }}
            />
          </NoSSR>
        </div>
        <div className="flex flex-shrink-0 gap-2 fill-white">
          <SocialIcons />
        </div>
      </div>
    </div>
  );
};

export default AnnouncementBar;
