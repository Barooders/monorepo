import React from 'react';
import config from '@/config/env';
import { FullArticle } from '@/types';
import { fetchArticle, fetchTagList } from '@/clients/articles';
import Tag from '@/components/atoms/Tag';
import Image from '@/components/atoms/Image';
import Breadcrumbs from '@/components/atoms/Breadcrumbs';
import { getDictionary } from '@/i18n/translate';
import BlogLayout from '@/components/layouts/blog';
import startCase from 'lodash/startCase';
import { marked } from 'marked';
import { Metadata } from 'next';

const dict = getDictionary('fr');

export type PropsType = {
  article: FullArticle;
  tagList: string[];
};

export const getMetadata = async (articleHandle: string): Promise<Metadata> => {
  const [article] = await Promise.all([fetchArticle(articleHandle)]);

  return {
    title: article.seoTitle,
    description: article.seoDescription,
    openGraph: {
      title: article.seoTitle,
      description: article.seoDescription,
      images: [{ url: article.imageSrc ?? '' }],
    },
    twitter: {
      title: article.seoTitle,
      description: article.seoDescription,
      images: [{ url: article.imageSrc ?? '' }],
    },
    alternates: {
      canonical: `${config.baseUrl}/blogs/infos/${articleHandle}`,
    },
  };
};

export const getData = async (articleHandle: string): Promise<PropsType> => {
  const [tagList, article] = await Promise.all([
    fetchTagList(),
    fetchArticle(articleHandle),
  ]);

  return {
    article,
    tagList,
  };
};

const BlogArticle: React.FC<PropsType> = ({ article, tagList }) => {
  if (!article) throw new Error('Could not find article');
  return (
    <>
      <BlogLayout tagList={tagList}>
        <div className="flex flex-col gap-5">
          <Breadcrumbs
            elements={[
              {
                title: dict.blog.blogBreadcrumb,
                link: '/blogs/infos',
              },
            ]}
          />
          <div className="flex gap-2">
            {article.tags.map((tag) => (
              <Tag
                key={tag}
                label={startCase(tag).toUpperCase()}
                link={`/blogs/infos/tagged/${tag}`}
              />
            ))}
          </div>
          <h1 className="my-3 text-center text-3xl font-semibold">
            {article.title}
          </h1>
          <div className="text-sm font-light uppercase italic text-gray-500">
            {article.createdAt.toLocaleDateString('fr-FR', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </div>

          {article.imageSrc && (
            <Image
              src={article.imageSrc}
              format="full"
              altText={article.title}
            />
          )}
          <div
            className="blog-article"
            dangerouslySetInnerHTML={{ __html: marked(article.htmlContent) }}
          />
          {article.tags && article.tags.length > 0 && (
            <div className="flex items-center gap-3">
              <div className="font-semibold">{dict.blog.moreArticles}:</div>
              {article.tags.map((tag) => (
                <Tag
                  key={tag}
                  label={startCase(tag).toUpperCase()}
                  link={`/blogs/infos/tagged/${tag}`}
                />
              ))}
            </div>
          )}
        </div>
      </BlogLayout>
    </>
  );
};

export default BlogArticle;
