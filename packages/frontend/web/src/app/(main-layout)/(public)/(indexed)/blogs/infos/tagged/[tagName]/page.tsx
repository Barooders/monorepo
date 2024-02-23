import BlogList, { getData } from '@/components/pages/Blog/List';
import { AppRouterPage } from '@/types';

export const dynamic = 'force-dynamic';

const BlogListPage: AppRouterPage<
  {
    tagName: string;
  },
  {
    page?: string;
  }
> = async ({ params, searchParams }) => {
  const pageNumber = searchParams.page ?? '';

  const blogListProps = await getData(pageNumber, params.tagName);

  return <BlogList {...blogListProps} />;
};

export default BlogListPage;
