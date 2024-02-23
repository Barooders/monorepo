import BlogArticle, {
  getData,
  getMetadata,
} from '@/components/pages/Blog/Article';
import { AppRouterPage } from '@/types';
import { Metadata } from 'next';

type ParamsType = {
  articleHandle: string;
};

export const dynamic = 'force-dynamic';

export async function generateMetadata({
  params,
}: {
  params: ParamsType;
}): Promise<Metadata> {
  return await getMetadata(params.articleHandle);
}

const BlogArticlePage: AppRouterPage<ParamsType> = async ({ params }) => {
  const blogArticleProps = await getData(params.articleHandle);

  return <BlogArticle {...blogArticleProps} />;
};

export default BlogArticlePage;
