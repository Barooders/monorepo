import { builder, BuilderContent } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/pages/Builder';
import { getDictionary } from '@/i18n/translate';
import HomeJsonLd from '@/components/atoms/JsonLd/HomeJsonLd';
import SnowFall from '@/components/molecules/Snowfall';

const dict = getDictionary('fr');

builder.init(process.env.NEXT_PUBLIC_BUILDER_IO_API_KEY ?? '');

export type PropsType = {
  content: BuilderContent;
};

export const getData = async (): Promise<PropsType> => {
  const content = await builder
    .get('page', {
      userAttributes: {
        urlPath: '/',
      },
      prerender: false,
    })
    .toPromise();

  return { content };
};

const HomePage: React.FC<PropsType> = ({ content }) => {
  return (
    <>
      <div className="z-10">
        <SnowFall />
      </div>
      <h1 className="hidden">{dict.homepage.mainTitle}</h1>
      <RenderBuilderContent content={content} />
      <HomeJsonLd />
    </>
  );
};

export default HomePage;
