import BlogList, { getData } from '@/components/pages/Blog/List';
import { AppRouterPage } from '@/types';

export const dynamic = 'force-dynamic';

const BlogListPage: AppRouterPage<
  null,
  {
    page?: string;
  }
> = async ({ searchParams }) => {
  const pageNumber = searchParams.page;

  const blogListProps = await getData(pageNumber ?? '');

  return <BlogList {...blogListProps} />;
};

export default BlogListPage;
