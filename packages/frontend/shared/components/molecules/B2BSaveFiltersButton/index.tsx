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
import B2BSaveFiltersForm from './B2BSaveFiltersForm';

const dict = getDictionary('fr');

const B2BSaveFiltersButton: React.FC<{ className?: string }> = ({
  className,
}) => {
  const { items } = useCurrentRefinements();
  const { query } = useSearchBox();

  if (items.length === 0 && !query) return <></>;

  return (
    <NoSSR>
      <Modal
        ButtonComponent={({ openModal }) => (
          <>
            <Button
              onClick={openModal}
              intent="primary"
              className={`text-md w-full shadow-md ${className}`}
            >
              <div className="flex items-center gap-2">
                <FiSave className="text-white" />
                {dict.b2b.proPage.saveFilters.buttonLabel}
              </div>
            </Button>
            <div className="h-px bg-gray-300" />
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
