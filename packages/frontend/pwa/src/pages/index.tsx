import { fetchProductByHandle } from '@/clients/products';
import { getMenuData } from '@/components/molecules/MegaMenu';
import { getData as getProductCardData } from '@/components/molecules/ProductCard/b2c/container';
import HomePage from '@/components/pages/Homepage';
import { getHomepageConfig } from '@/components/pages/Homepage/getHomepageConfig';
import ProductPage from '@/components/pages/ProductPage';
import SearchPage from '@/components/pages/SearchPage';
import { getData as getSearchPageData } from '@/components/pages/SearchPage/container';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import FullPageIframe from '../components/FullPageIframe';
import Root from '../components/Root';
import WithLoaderDataAsProps from '../components/WithLoaderAsProps';

const WrappedRoot = WithLoaderDataAsProps(Root);
const WrappedHomepage = WithLoaderDataAsProps(HomePage);
const WrappedCollectionPage = WithLoaderDataAsProps(SearchPage);
const WrappedProductPage = WithLoaderDataAsProps(ProductPage);

const Router: React.FC = () => {
  const hashRouter = createHashRouter([
    {
      path: '/',
      element: <WrappedRoot />,
      loader: async () => ({ menu: await getMenuData() }),
      children: [
        {
          index: true,
          element: <WrappedHomepage />,
          loader: getHomepageConfig,
        },
        {
          path: 'collections/:collectionHandle',
          element: <WrappedCollectionPage />,
          loader: async ({ params, request }) => {
            const url = new URL(request.url);
            const vendorSellerName = url.searchParams.get('q') ?? undefined;
            const highlightProductHandle =
              url.searchParams.get('handle') ?? undefined;
            const highlightProductVariant =
              url.searchParams.get('variant') ?? undefined;

            return await getSearchPageData({
              collectionHandle: params.collectionHandle,
              vendorSellerName,
              productHandle: highlightProductHandle,
              productVariantShopifyId: Number(highlightProductVariant),
            });
          },
        },
        {
          path: 'products/:productHandle',
          element: <WrappedProductPage />,
          loader: async ({ params, request }) => {
            const url = new URL(request.url);
            const productVariantShopifyId =
              url.searchParams.get('variant') ?? undefined;
            const [productCardProps, productByHandle] = await Promise.all([
              getProductCardData({
                productHandle: params.productHandle,
                productVariantShopifyId: Number(productVariantShopifyId),
              }),
              fetchProductByHandle(params.productHandle ?? ''),
            ]);

            return {
              productCardProps,
              productByHandle,
            };
          },
        },
      ],
    },
    {
      path: '*',
      element: <FullPageIframe />,
      loader: async ({ request }) => {
        const url = new URL(request.url);
        const urlPath = url.hash;

        return {
          urlPath,
        };
      },
    },
  ]);

  return <RouterProvider router={hashRouter} />;
};

export default Router;
