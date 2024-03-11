import Breadcrumbs from '@/components/atoms/Breadcrumbs';
import Image from '@/components/atoms/Image';
import Tag from '@/components/atoms/Tag';
import BlogLayout from '@/components/layouts/blog';
import { getDictionary } from '@/i18n/translate';
import { FullArticle } from '@/types';
import startCase from 'lodash/startCase';
import { marked } from 'marked';
import React from 'react';
import CollectionPreviewInjector from './CollectionPreviewInjector';

const dict = getDictionary('fr');

export type PropsType = {
  article: FullArticle;
  tagList: string[];
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
        <CollectionPreviewInjector />
      </BlogLayout>
    </>
  );
};

export default BlogArticle;
