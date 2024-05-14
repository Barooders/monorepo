import useStoreSavedSearch from '@/hooks/useStoreSavedSearch';
import useUpdateSavedSearch from '@/hooks/useUpdateSavedSearch';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { mapCurrentSearch } from '@/mappers/search';
import { memo, useMemo } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCurrentRefinements } from 'react-instantsearch-hooks-web';
import Button from '../../atoms/Button';
import Loader from '../../atoms/Loader';
import useB2BSearchContext from '../B2BSearchBar/_state/useB2BSearchContext';

const dict = getDictionary('fr');

type PropsType = {
  onSave: () => void;
  onClose: () => void;
  currentRefinements: ReturnType<typeof useCurrentRefinements>['items'];
  query: string;
};

const B2BSaveFiltersForm: React.FC<PropsType> = ({
  onSave,
  currentRefinements,
  query,
}) => {
  const [, storeSavedSearch] = useStoreSavedSearch();
  const [, updateSavedSearch] = useUpdateSavedSearch();
  const { savedSearch } = useB2BSearchContext();

  const refinements = currentRefinements
    .flatMap((item) => item.refinements)
    .map(({ value, ...refinement }) => ({
      ...refinement,
      value: String(value),
    }));

  const formMethods = useForm({});

  const onSubmit = async () => {
    if (savedSearch === undefined) {
      await storeSavedSearch({
        name: dict.b2b.proPage.saveFilters.defaultSavedSearchName,
        type: 'B2B_MAIN_PAGE',
        resultsUrl: `https://${process.env.NEXT_PUBLIC_FRONT_DOMAIN}/pro/search`,
        query,
        refinements,
        shouldTriggerAlerts: false,
      });
    } else {
      await updateSavedSearch(savedSearch.id, {
        query,
        refinements,
      });
    }

    toast.success(dict.b2b.proPage.saveFilters.successToaster);
    onSave();
  };

  const [submitState, doSubmit] = useWrappedAsyncFn(onSubmit);

  const activeFilters = useMemo(
    () => mapCurrentSearch(refinements, query),
    [refinements, query],
  );

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(doSubmit)}
        className="p-3"
      >
        <p className="text-2xl font-bold">
          {dict.b2b.proPage.saveFilters.title}
        </p>
        <p className="mt-3 text-sm text-slate-600">
          {dict.b2b.proPage.saveFilters.description}
        </p>
        <div className="mt-5 flex flex-col rounded-xl border border-slate-200 p-5">
          <p className="text-base font-semibold">
            {dict.b2b.proPage.saveFilters.selectedFilters}
          </p>
          {activeFilters.map((refinement, index) => (
            <p
              key={index}
              className="mt-1 rounded-xl border border-slate-200 bg-slate-100 p-2"
            >
              {refinement}
            </p>
          ))}
          {activeFilters.length === 0 ? (
            <p className="mt-1 text-slate-600">
              {dict.b2b.proPage.saveFilters.noSelectedFilters}
            </p>
          ) : (
            <></>
          )}
        </div>
        {submitState.error && (
          <p className="text-red-600">{submitState.error.message}</p>
        )}
        <Button
          className="mt-5 flex w-full justify-center py-3 text-sm font-medium uppercase"
          type="submit"
          intent="primary"
        >
          {submitState.loading ? (
            <Loader />
          ) : (
            dict.b2b.proPage.saveFilters.validate
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default memo(B2BSaveFiltersForm);
