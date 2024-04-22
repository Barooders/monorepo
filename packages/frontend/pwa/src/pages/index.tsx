import HomePage, { getData as getHomeData } from '@/components/pages/Homepage';
import { RouterProvider, createHashRouter } from 'react-router-dom';
import SearchPage, {
  getData as getSearchPageData,
} from '@/components/pages/SearchPage';
import ProductPage from '@/components/pages/ProductPage';
import { fetchProductByHandle } from '@/clients/products';
import { getData as getProductCardData } from '@/components/molecules/ProductCard/b2c/container';
import { getMenuData } from '@/components/molecules/MegaMenu';
import WithLoaderDataAsProps from '../components/WithLoaderAsProps';
import Root from '../components/Root';
import FullPageIframe from '../components/FullPageIframe';

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
          loader: getHomeData,
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
              productVariant: highlightProductVariant,
            });
          },
        },
        {
          path: 'products/:productHandle',
          element: <WrappedProductPage />,
          loader: async ({ params, request }) => {
            const url = new URL(request.url);
            const productVariant = url.searchParams.get('variant') ?? undefined;
            const [productCardProps, productByHandle] = await Promise.all([
              getProductCardData({
                productHandle: params.productHandle,
                productVariant,
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
