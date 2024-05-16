import { getDictionary } from '@/i18n/translate';
import { memo } from 'react';
import { FiSave } from 'react-icons/fi';
import {
  useCurrentRefinements,
  useSearchBox,
} from 'react-instantsearch-hooks-web';
import Button from '../../atoms/Button';
import Modal from '../../atoms/Modal';
import NoSSR from '../../atoms/NoSSR';
import useB2BSearchContext, {
  SavedSearch,
} from '../B2BSearchBar/_state/useB2BSearchContext';
import B2BSaveFiltersForm from './B2BSaveFiltersForm';

const dict = getDictionary('fr');

const shouldHideSaveButton = (
  items: unknown[],
  query: string,
  savedSearch: SavedSearch | undefined,
) => {
  const hasSavedSearchWithFilter =
    savedSearch === undefined
      ? false
      : savedSearch.FacetFilters.length > 0 ||
        savedSearch.NumericFilters.length > 0 ||
        savedSearch.query;

  return !hasSavedSearchWithFilter && items.length === 0 && !query;
};

const B2BSaveFiltersButton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { items } = useCurrentRefinements();
  const { query } = useSearchBox();
  const { savedSearch } = useB2BSearchContext();

  if (shouldHideSaveButton(items, query, savedSearch)) {
    return <></>;
  }

  return (
    <NoSSR>
      <Modal
        ButtonComponent={({ openModal }) => (
          <>
            <Button
              onClick={openModal}
              intent="primary"
              className={`text-md shadow-md ${className}`}
            >
              <div className="flex items-center gap-2">
                <FiSave className="text-white" />
                {dict.b2b.proPage.saveFilters.buttonLabel}
              </div>
            </Button>
            <hr className="my-3 border-b-gray-200" />
          </>
        )}
        ContentComponent={({ closeModal }) => (
          <B2BSaveFiltersForm
            onSave={closeModal}
            onClose={closeModal}
            currentRefinements={items}
            query={query}
          />
        )}
      />
    </NoSSR>
  );
};

export default memo(B2BSaveFiltersButton);
