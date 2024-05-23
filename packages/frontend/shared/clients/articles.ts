import {
  StrapiEntity,
  StrapiEntityList,
  StrapiMedia,
} from '@/components/pages/SellingForm/types';
import dayjs from '@/providers/dayjs';
import { FullArticle, ListArticle } from '@/types';
import stripHtml from '@/utils/stripHtml';
import first from 'lodash/first';
import { fetchStrapi } from './strapi';

type StrapiArticle = {
  title: string;
  handle: string;
  content: string;
  blurb?: string;
  authorName: string;
  createdAt: string;
  cover: { data?: StrapiEntity<StrapiMedia> };
  blog_tags?: StrapiEntityList<StrapiTag>;
  seoTitle?: string;
  seoDescription?: string;
};

type StrapiTag = { name: string };

export const ARTICLES_PER_PAGE = 30;

export const fetchTagList = async (): Promise<string[]> => {
  const response = await fetchStrapi<StrapiEntityList<StrapiTag>>('/blog-tags');
  return response.data.map((tag) => tag.attributes.name);
};

export const fetchArticles = async (
  page: number,
  tagName?: string,
): Promise<ListArticle[]> => {
  const searchParams = new URLSearchParams({
    'pagination[page]': page.toString(),
    'pagination[pageSize]': ARTICLES_PER_PAGE.toString(),
    'fields[0]': 'title',
    'fields[1]': 'title',
    'fields[2]': 'handle',
    'fields[3]': 'blurb',
    'fields[4]': 'author_name',
    'fields[5]': 'created_at',
    populate: '*',
    'sort[0]': 'createdAt:desc',
  });
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  if (tagName) {
    searchParams.append('filters[blog_tags][name][$eq]', tagName);
  }

  const response = await fetchStrapi<StrapiEntityList<StrapiArticle>>(
    `/blog-articles?${searchParams.toString()}`,
  );

  return response.data.map(mapArticle);
};

export const fetchArticle = async (handle: string): Promise<FullArticle> => {
  const searchParams = new URLSearchParams({
    'filters[handle][$eq]': handle,
    populate: '*',
  });
  const response = await fetchStrapi<StrapiEntityList<StrapiArticle>>(
    `/blog-articles?${searchParams.toString()}`,
  );

  const foundArticle = first(response.data);

  if (!foundArticle) {
    throw new Error(`Article ${handle} not found in Strapi`);
  }

  return mapFullArticle(foundArticle);
};

export const mapArticle = (
  articleFromAPI: StrapiEntity<StrapiArticle>,
): ListArticle => ({
  author: articleFromAPI.attributes.authorName ?? 'Anonymous',
  blurb: articleFromAPI.attributes.blurb ?? null,
  createdAt: dayjs(articleFromAPI.attributes.createdAt ?? '').toDate(),
  handle: articleFromAPI.attributes.handle,
  title: articleFromAPI.attributes.title,
  tags:
    articleFromAPI.attributes.blog_tags?.data.map(
      (item) => item.attributes.name,
    ) ?? [],
  imageSrc: articleFromAPI.attributes.cover.data
    ? articleFromAPI.attributes.cover.data.attributes.url
    : null,
});

export const mapFullArticle = (
  articleFromAPI: StrapiEntity<StrapiArticle>,
): FullArticle => ({
  ...mapArticle(articleFromAPI),
  htmlContent: articleFromAPI?.attributes.content,
  seoDescription:
    articleFromAPI.attributes.seoDescription ??
    stripHtml(articleFromAPI.attributes.blurb) ??
    stripHtml(articleFromAPI.attributes.content.slice(0, 200)) ??
    '',
  seoTitle:
    articleFromAPI.attributes.seoTitle ??
    `${articleFromAPI.attributes.title} | Barooders`,
});
