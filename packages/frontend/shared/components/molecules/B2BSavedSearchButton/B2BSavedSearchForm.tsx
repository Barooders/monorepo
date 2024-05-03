import useStoreSavedSearch from '@/hooks/useStoreSavedSearch';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { mapCurrentSearch } from '@/mappers/search';
import { FormProvider, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import {
  useCurrentRefinements,
  useSearchBox,
} from 'react-instantsearch-hooks-web';
import Button from '../../atoms/Button';
import Loader from '../../atoms/Loader';
import FormInput from '../FormInput';

const dict = getDictionary('fr');

type PropsType = {
  onSave: () => void;
  onClose: () => void;
};

const B2BSavedSearchForm: React.FC<PropsType> = ({ onSave }) => {
  const [, storeSavedSearch] = useStoreSavedSearch();
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
    await storeSavedSearch({
      name: 'Recherche B2B',
      type: 'B2B_MAIN_PAGE',
      resultsUrl: window.location.href,
      query,
      refinements,
      shouldTriggerAlerts: false,
    });

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
          <FormInput
            label={dict.b2b.proPage.saveSearch.form.title}
            name={`saveSearchTitle`}
            type="text"
            options={{
              required: dict.global.forms.required,
            }}
          />
          <div className="mt-3">
            <p className="text-base font-semibold">
              {dict.b2b.proPage.saveSearch.selectedFilters}
            </p>
            {mapCurrentSearch(refinements, query).map((refinement, index) => (
              <p
                key={index}
                className="mt-1 rounded-xl border border-slate-200 bg-slate-100 p-2"
              >
                {refinement}
              </p>
            ))}
          </div>
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
            dict.b2b.proPage.saveSearch.validate
          )}
        </Button>
      </form>
    </FormProvider>
  );
};

export default B2BSavedSearchForm;
