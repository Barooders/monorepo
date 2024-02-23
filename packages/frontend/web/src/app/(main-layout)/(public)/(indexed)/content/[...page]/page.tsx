import { builder } from '@builder.io/sdk';
import { RenderBuilderContent } from '@/components/pages/Builder';
import { AppRouterPage } from '@/types';

// Replace with your Public API Key
builder.init(process.env.NEXT_PUBLIC_BUILDER_IO_API_KEY ?? '');

export const metadata = {
  robots: {
    index: true,
    follow: true,
  },
};

const ContentPage: AppRouterPage<{
  page: string[];
}> = async (props) => {
  const content = await builder

    // Get the page content from Builder with the specified options
    .get('page', {
      userAttributes: {
        // Use the page path specified in the URL to fetch the content
        urlPath: '/content/' + (props?.params?.page?.join('/') || ''),
      },
      // Set prerender to false to return JSON instead of HTML
      prerender: false,
    })
    // Convert the result to a promise
    .toPromise();

  return <RenderBuilderContent content={content} />;
};

export default ContentPage;
