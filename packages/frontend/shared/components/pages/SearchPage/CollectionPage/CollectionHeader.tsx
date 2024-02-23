import Breadcrumbs from '@/components/atoms/Breadcrumbs';
import ProductCard from '@/components/molecules/ProductCard';
import { TrackedElements } from '@/config/e2e';
import { getDictionary } from '@/i18n/translate';
import { useInstantSearch } from 'react-instantsearch-hooks-web';
import { GetDataType as SearchPageProps } from '../index';
import SortBy from '../_components/SortBy';
import ChildCollections from './ChildCollections';

const dict = getDictionary('fr');

type PropsType = {
  parentCollections: SearchPageProps['parentCollections'];
  collectionData: SearchPageProps['collectionData'];
  highlightedProduct: SearchPageProps['highlightedProduct'];
  childCollections: SearchPageProps['childCollections'];
};

const CollectionHeader: React.FC<PropsType> = ({
  parentCollections,
  collectionData,
  highlightedProduct,
  childCollections,
}) => {
  const { results } = useInstantSearch();

  if (!collectionData) return <></>;

  return (
    <>
      <div className="hidden lg:flex">
        {parentCollections && (
          <Breadcrumbs
            elements={[...parentCollections, { title: collectionData.title }]}
          />
        )}
      </div>
      <div className="mb-1 flex justify-between">
        <div className="flex items-end gap-2">
          <h1 className="text-xl font-semibold tracking-tight lg:text-3xl">
            {collectionData.title}{' '}
            {collectionData.type === 'productType' && dict.search.refurbished}
          </h1>
          <span
            className="text-lg font-light text-gray-500"
            data-id={TrackedElements.HITS_COUNT}
          >
            ( {results.nbHits} )
          </span>
        </div>
        <div className="hidden lg:flex">
          <SortBy />
        </div>
      </div>
      {highlightedProduct ? (
        <div className="mb-4 rounded-lg border border-gray-200 px-4 py-5">
          <ProductCard
            {...highlightedProduct}
            intent="highlight"
          />
        </div>
      ) : (
        childCollections && (
          <ChildCollections childCollections={childCollections} />
        )
      )}
    </>
  );
};

export default CollectionHeader;
