import Tag from '@/components/atoms/Tag';
import PageContainer from '@/components/atoms/PageContainer';
import { getDictionary } from '@/i18n/translate';
import startCase from 'lodash/startCase';

const dict = getDictionary('fr');

export type PropsType = {
  children: React.ReactNode;
  tagList: string[];
};

const BlogLayout: React.FC<PropsType> = ({ tagList, children }) => {
  return (
    <PageContainer>
      <div className="grid grid-cols-4">
        <div className="col-span-5 md:col-span-3 md:px-10">{children}</div>
        <div className="hidden border-l border-gray-100 px-5 pt-10 md:col-span-1 md:block">
          <div className="flex flex-col gap-3">
            <div className="text-xl font-semibold">{dict.blog.explore}</div>
            <div className="flex flex-wrap items-center gap-2">
              {tagList.map((tag) => (
                <Tag
                  key={tag}
                  label={startCase(tag).toUpperCase()}
                  link={`/blogs/infos/tagged/${tag}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </PageContainer>
  );
};

export default BlogLayout;
