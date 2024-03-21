import { useHasura } from '@/hooks/useHasura';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { gql } from '@apollo/client';
import capitalize from 'lodash/capitalize';
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

const B2BSearchAlertForm: React.FC<PropsType> = ({ onSave, onClose }) => {
  const { items } = useCurrentRefinements();
  const { query } = useSearchBox();
  const refinements = items.flatMap((item) => item.refinements);

  const storeSavedSearch = useHasura(gql`
    mutation storeSavedSearch($savedSearchInput: SavedSearch_insert_input!) {
      insert_SavedSearch_one(object: $savedSearchInput) {
        id
      }
    }
  `);

  const formMethods = useForm({});

  const onSubmit = async () => {
    await storeSavedSearch({
      savedSearchInput: {
        name: 'B2B search',
        type: 'B2B_MAIN_PAGE',
        query,
        FacetFilters: {
          data: refinements
            .filter((refinement) => refinement.type === 'disjunctive')
            .map((refinement) => ({
              facetName: refinement.attribute,
              value: String(refinement.value),
              label: String(refinement.label),
            })),
        },
        NumericFilters: {
          data: refinements
            .filter((refinement) => refinement.type === 'numeric')
            .map((refinement) => ({
              facetName: refinement.attribute,
              value: String(refinement.value),
              operator: String(refinement.operator),
            })),
        },
      },
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
          <div>
            <p className="text-base font-semibold">
              {dict.b2b.proPage.saveSearch.subTitle}
            </p>
            <p className="mt-1 text-sm text-slate-500">
              {[
                ...(query ? [query] : []),
                ...refinements
                  .map((refinement) =>
                    refinement.operator
                      ? `${refinement.operator} ${refinement.value}`
                      : refinement.label,
                  )
                  .map(String),
              ]
                .map(capitalize)
                .join('・')}
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

export default B2BSearchAlertForm;
