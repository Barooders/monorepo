import { sendCreateAlert } from '@/analytics';
import Input from '@/components/molecules/FormInput';
import useSearchPage from '@/hooks/state/useSearchPage';
import useUser from '@/hooks/state/useUser';
import useStoreSavedSearch from '@/hooks/useStoreSavedSearch';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { mapCurrentSearchToString } from '@/mappers/search';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useCurrentRefinements } from 'react-instantsearch-hooks-web';
import Button from '../../atoms/Button';
import Loader from '../../atoms/Loader';

const dict = getDictionary('fr');

type Inputs = {
  name: string;
};

type PropsType = {
  onSave: () => void;
  onClose: () => void;
};

const SavedSearchForm: React.FC<PropsType> = ({ onSave, onClose }) => {
  const { hasuraToken } = useUser.getState();
  const { items } = useCurrentRefinements();
  const [, storeSavedSearch] = useStoreSavedSearch();
  const collection = useSearchPage((state) => state.collection);
  const query = useSearchPage((state) => state.query);
  const refinements = items
    .flatMap((item) => item.refinements)
    .map(({ value, ...refinement }) => ({
      ...refinement,
      value: String(value),
    }));

  if (collection?.id && collection.name) {
    refinements.unshift({
      attribute: 'collection_handles',
      value: collection.handle,
      type: 'disjunctive',
      label: collection.name,
    });
  }

  const formMethods = useForm<Inputs>({
    defaultValues: {
      name: collection?.name ?? query ?? '',
    },
  });

  const onSubmit: SubmitHandler<Inputs> = async ({ name }) => {
    await storeSavedSearch({
      shouldTriggerAlerts: true,
      name,
      type: 'PUBLIC_COLLECTION_PAGE',
      collectionId: collection?.id.toString(),
      query: query ?? undefined,
      resultsUrl: window.location.href,
      refinements,
    });

    toast.success(dict.searchAlerts.successToaster);
    sendCreateAlert(
      hasuraToken?.user.id ?? 'unknown',
      refinements
        .filter((refinement) =>
          ['numeric', 'disjunctive'].includes(refinement.type),
        )
        .map(
          (refinement) =>
            `${refinement.attribute} ${refinement.operator ?? ':'} ${
              refinement.value
            }`,
        ),
    );
    onSave();
  };

  const [submitState, doSubmit] = useWrappedAsyncFn(onSubmit);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(doSubmit)}
        className="p-3"
      >
        <p className="text-2xl font-bold">{dict.searchAlerts.title}</p>
        <p className="mt-3 text-sm text-slate-600">
          {dict.searchAlerts.description}
        </p>
        <div className="mt-5 flex flex-col rounded-xl border border-slate-200 p-5">
          <Input
            label={dict.searchAlerts.form.nameInputLabel}
            name="name"
            type="text"
            options={{ required: dict.global.forms.required }}
            placeholder={dict.searchAlerts.form.namePlaceholder}
          />
          <div>
            <p className="text-base font-semibold">
              {dict.searchAlerts.form.alertLabel}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {mapCurrentSearchToString(refinements)}
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
          {submitState.loading ? <Loader /> : dict.searchAlerts.form.validate}
        </Button>
        <Button
          type="button"
          className="mt-1 w-full py-3 text-sm font-medium uppercase"
          onClick={onClose}
          intent="tertiary"
        >
          {dict.searchAlerts.form.modify}
        </Button>
      </form>
    </FormProvider>
  );
};

export default SavedSearchForm;
