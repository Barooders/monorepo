import { SavedSearchContext } from '@/contexts/savedSearch';
import useStoreSavedSearch from '@/hooks/useStoreSavedSearch';
import useUpdateSavedSearch from '@/hooks/useUpdateSavedSearch';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { mapCurrentSearchToString } from '@/mappers/search';
import { useContext, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  useCurrentRefinements,
  useSearchBox,
} from 'react-instantsearch-hooks-web';
import Button from '../../atoms/Button';
import Loader from '../../atoms/Loader';

const dict = getDictionary('fr');

type PropsType = {
  onSave: () => void;
  onClose: () => void;
};

const B2BSavedSearchForm: React.FC<PropsType> = ({ onSave, onClose }) => {
  const existingSavedSearch = useContext(SavedSearchContext);
  const [savedSearchId, setSavedSearchId] = useState<string | undefined>(
    existingSavedSearch?.id,
  );
  const [, storeSavedSearch] = useStoreSavedSearch();
  const [, updateSavedSearch] = useUpdateSavedSearch();
  const { items } = useCurrentRefinements();
  const { query } = useSearchBox();
  const refinements = items
    .flatMap((item) => item.refinements)
    .map(({ value, ...refinement }) => ({
      ...refinement,
      value: String(value),
    }));

  const formMethods = useForm({});

  const onSubmit = async () => {
    if (savedSearchId) {
      await updateSavedSearch(savedSearchId, {
        query,
        refinements,
      });
    } else {
      const newSavedSearchId = await storeSavedSearch({
        name: 'B2B search',
        type: 'B2B_MAIN_PAGE',
        resultsUrl: window.location.href,
        query,
        refinements,
        shouldTriggerAlerts: false,
      });
      setSavedSearchId(newSavedSearchId);
    }

    toast.success(dict.b2b.proPage.saveSearch.successToaster);
    onSave();
  };

  const [submitState, doSubmit] = useWrappedAsyncFn(onSubmit);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(doSubmit)}
        className="p-3"
      >
        <p className="text-2xl font-bold">
          {dict.b2b.proPage.saveSearch.title}
        </p>
        <p className="mt-3 text-sm text-slate-600">
          {dict.b2b.proPage.saveSearch.description}
        </p>
        <div className="mt-5 flex flex-col rounded-xl border border-slate-200 p-5">
          <div>
            <p className="text-base font-semibold">
              {dict.b2b.proPage.saveSearch.subTitle}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {mapCurrentSearchToString(refinements, query)}
            </p>
          </div>
        </div>
        {submitState.error && (
          <p className="text-red-600">{submitState.error.message}</p>
        )}
        <Button
          className="mt-5 flex w-full justify-center py-3 text-sm font-medium uppercase"
          type="submit"
          intent="secondary"
        >
          {submitState.loading ? (
            <Loader />
          ) : (
            dict.b2b.proPage.saveSearch.validate
          )}
        </Button>
        <Button
          type="button"
          className="mt-1 w-full py-3 text-sm font-medium uppercase"
          onClick={onClose}
          intent="tertiary"
        >
          {dict.b2b.proPage.saveSearch.modify}
        </Button>
      </form>
    </FormProvider>
  );
};

export default B2BSavedSearchForm;
