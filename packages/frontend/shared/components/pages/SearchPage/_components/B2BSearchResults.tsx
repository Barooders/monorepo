import Button from '@/components/atoms/Button';
import Link from '@/components/atoms/Link';
import Characteristics from '@/components/molecules/ProductCard/_components/Characteristics';
import ProductImage from '@/components/molecules/ProductCard/_components/ProductImage';
import ProductPrice from '@/components/molecules/ProductCard/_components/ProductPrice';
import { getDictionary } from '@/i18n/translate';
import { fromSearchToB2BProductCard } from '@/mappers/fromSearchToProductCard';
import { Hits, useInstantSearch } from 'react-instantsearch-hooks-web';
import { SearchB2BVariantDocument } from 'shared-types';

const dict = getDictionary('fr');

const NoResultsBoundary: React.FC<{
  children: React.ReactNode;
  fallback: React.ReactNode;
}> = ({ children, fallback }) => {
  const { results } = useInstantSearch();

  if (!results.__isArtificial && results.nbHits === 0) {
    return (
      <>
        {fallback}
        <div hidden>{children}</div>
      </>
    );
  }

  return <>{children}</>;
};

function NoResults() {
  return (
    <div className="mb-20 flex flex-col items-start gap-1">
      <p className="text-lg font-semibold text-slate-800">
        {dict.search.noResults.title}
      </p>
      <p className="text-sm text-slate-500">{dict.search.noResults.subtitle}</p>
    </div>
  );
}

const B2BSearchResults: React.FC = () => {
  return (
    <NoResultsBoundary fallback={<NoResults />}>
      <Hits
        classNames={{
          list: 'grid grid-cols-2 md:grid-cols-3 gap-x-2 gap-y-4',
        }}
        hitComponent={({ hit }: { hit: SearchB2BVariantDocument }) => {
          const {
            id,
            image,
            title,
            tags,
            productType,
            variantCondition,
            price,
            stock,
          } = fromSearchToB2BProductCard(hit);
          return (
            <Link href={'/'}>
              <div className="grid w-full grid-cols-2 gap-1 overflow-hidden">
                <div className="relative col-span-2 h-52 w-full flex-grow sm:h-64">
                  {image && (
                    <ProductImage
                      image={image}
                      labels={[]}
                      discounts={[]}
                    />
                  )}
                </div>
                <div className="relative col-span-2 my-auto flex flex-grow flex-col">
                  <Characteristics
                    tags={tags}
                    title={title}
                    productType={productType}
                    variantCondition={variantCondition}
                    componentSize="medium"
                  />
                  <p className="mt-2 text-xs text-gray-600 lg:text-sm">
                    Quantité disponible: {stock}
                  </p>
                  <div className="my-1">
                    <ProductPrice
                      productId={id}
                      discounts={[]}
                      compareAtPrice={price}
                      price={price}
                    />
                  </div>
                  <Button
                    intent="primary"
                    href="/"
                    className="mt-2"
                  >
                    Faire une offre
                  </Button>
                </div>
              </div>
            </Link>
          );
        }}
      />
      {/* <div className="sticky bottom-10 left-0 right-0 mt-5 hidden justify-center md:flex">
        <SearchAlertButton />
      </div> */}
    </NoResultsBoundary>
  );
};

export default B2BSearchResults;
