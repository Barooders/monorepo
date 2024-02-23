import React from 'react';
import Link from '@/components/atoms/Link';
import Image from '@/components/atoms/Image';
import { ListArticle } from '@/types';
import {
  ARTICLES_PER_PAGE,
  fetchArticles,
  fetchTagList,
} from '@/clients/articles';
import BlogLayout from '@/components/layouts/blog';
import Tag from '@/components/atoms/Tag';
import { getDictionary } from '@/i18n/translate';
import startCase from 'lodash/startCase';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const dict = getDictionary('fr');

type PropsType = {
  articles: ListArticle[];
  pageNumber: number;
  tagList: string[];
};

export const getData = async (
  selectedPageNumber: string,
  tagName?: string,
): Promise<PropsType> => {
  const pageNumber = selectedPageNumber ? parseInt(selectedPageNumber) : 1;
  const [tagList, articles] = await Promise.all([
    fetchTagList(),
    fetchArticles(pageNumber, tagName),
  ]);

  return {
    articles,
    pageNumber,
    tagList,
  };
};

const BlogList: React.FC<PropsType> = ({ articles, pageNumber, tagList }) => {
  return (
    <BlogLayout tagList={tagList}>
      <h1 className="py-7 text-center text-4xl font-medium">
        {dict.blog.blogName}
      </h1>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.handle}
            href={`/blogs/infos/${article.handle}`}
            className="flex flex-col items-center gap-3"
          >
            <div className="relative h-[200px] w-full">
              {article.imageSrc && (
                <div className="h-full w-full overflow-hidden">
                  <Image
                    format="large"
                    altText={article.title}
                    src={article.imageSrc}
                    className="object-cover"
                  />
                </div>
              )}
              <div className="absolute bottom-0 right-0 left-0 flex h-0 items-center justify-center gap-2 border-b border-black">
                {article.tags.slice(0, 2).map((tag) => (
                  <Tag
                    key={tag}
                    label={startCase(tag).toUpperCase()}
                  />
                ))}
              </div>
            </div>
            <strong className="mt-3 px-3 text-center text-xl font-light">
              {article.title}
            </strong>
            <div className="text-sm font-light uppercase italic text-gray-400">
              {article.createdAt.toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </Link>
        ))}
      </div>
      <div className="mt-10 flex w-full justify-center gap-10">
        {pageNumber > 1 && (
          <Link
            className="flex items-center justify-center rounded-full bg-gray-800 p-4 text-white"
            href={`/blogs/infos?page=${pageNumber - 1}`}
          >
            <FaChevronLeft />
          </Link>
        )}

        {articles.length === ARTICLES_PER_PAGE && (
          <Link
            className="flex items-center justify-center rounded-full bg-gray-800 p-4 text-white"
            href={`/blogs/infos?page=${pageNumber + 1}`}
          >
            <FaChevronRight />
          </Link>
        )}
      </div>
    </BlogLayout>
  );
};

export default BlogList;
