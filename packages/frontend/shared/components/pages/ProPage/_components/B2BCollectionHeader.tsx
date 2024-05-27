import Callout, { CalloutTypes } from '@/components/atoms/Callout';
import SortBy from '@/components/molecules/Filters/SortBy';
import { B2BGuarantees } from '@/components/molecules/ProductCard/_components/Guarantees';
import { useHasuraToken } from '@/hooks/useHasuraToken';
import { getDictionary } from '@/i18n/translate';
import { useInstantSearch } from 'react-instantsearch';
import { useLocalStorage } from 'react-use';
import { SalesChannelName } from 'shared-types';

const dict = getDictionary('fr');

const B2B_TUTORIAL_NAME = 'b2b-welcome';

const B2BCollectionHeader: React.FC = () => {
  const { results } = useInstantSearch();
  const { extractTokenInfo } = useHasuraToken();
  const { sellerName } = extractTokenInfo();
  const [readTutorials, setReadTutorials] = useLocalStorage<string[]>(
    'readTutorials',
    [],
  );

  const needToWelcome = !(readTutorials ?? []).some(() => B2B_TUTORIAL_NAME);

  return (
    <div className="mb-1 flex flex-col justify-between">
      {needToWelcome && (
        <Callout
          onClose={() =>
            setReadTutorials([...(readTutorials ?? []), B2B_TUTORIAL_NAME])
          }
          closable={true}
          type={CalloutTypes.INFO}
          title={dict.b2b.proPage.tutorial.title(sellerName ?? '')}
          content={
            <div className="text-sm">{dict.b2b.proPage.tutorial.content()}</div>
          }
        />
      )}
      <div className="hidden md:block">
        <B2BGuarantees />
      </div>
      <div className="mt-5 flex items-center justify-between">
        <div className="flex items-end gap-2">
          <h1 className="text-xl font-semibold tracking-tight lg:text-3xl">
            {dict.b2b.proPage.title}
          </h1>
          <span className="text-lg font-light text-gray-500">
            ( {results.nbHits} )
          </span>
        </div>
        <SortBy salesChannel={SalesChannelName.B2B} />
      </div>
    </div>
  );
};

export default B2BCollectionHeader;
