import { fetchArticle, fetchTagList } from '@/clients/articles';
import config from '@/config/env';
import { FullArticle } from '@/types';
import { Metadata } from 'next';

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
