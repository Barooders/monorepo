import { operations } from '@/__generated/rest-schema';
import Button from '@/components/atoms/Button';
import Loader from '@/components/atoms/Loader';
import Separator from '@/components/atoms/Separator';
import YesNoSelector from '@/components/atoms/YesNoSelector';
import useUser from '@/hooks/state/useUser';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { getDictionary } from '@/i18n/translate';
import { FormProvider, SubmitHandler, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import FormInput from '../FormInput';

const dict = getDictionary('fr');

type Inputs = {
  openToNegociation: boolean;
  maxAmountPercent: number;
  phoneNumber: string;
};

export type PropsType = {
  agreementId?: string;
  maxAmountPercent?: number;
  openToNegociation?: boolean;
  onSuccess?: () => void;
  phoneNumber?: string;
};

const PersonalInfoForm: React.FC<PropsType> = ({
  agreementId,
  maxAmountPercent,
  openToNegociation,
  onSuccess,
  phoneNumber,
}) => {
  const formMethods = useForm<Inputs>({
    defaultValues: {
      openToNegociation,
      maxAmountPercent,
      phoneNumber,
    },
  });
  const { hasuraToken, setHasuraToken } = useUser();
  const { fetchAPI } = useBackend();

  const watchOpenToNego = formMethods.watch('openToNegociation');

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    if (!hasuraToken) {
      throw new Error('Need login to update personal info');
    }

    if (agreementId && !data.openToNegociation) {
      await fetchAPI('/v1/negociation-agreement', { method: 'DELETE' });
    }

    if (data.openToNegociation) {
      const body: operations['CustomerController_upsertNegociationAgreement']['requestBody']['content']['application/json'] =
        {
          maxAmountPercent: data.maxAmountPercent,
        };
      await fetchAPI('/v1/negociation-agreement', {
        method: 'POST',
        body: JSON.stringify(body),
      });
    }

    if (data.phoneNumber) {
      const body: operations['CustomerController_updateUserInfo']['requestBody']['content']['application/json'] =
        {
          phoneNumber: data.phoneNumber,
        };
      await fetchAPI('/v1/customers', {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      setHasuraToken({
        ...hasuraToken,
        user: { ...hasuraToken.user, phoneNumber: data.phoneNumber },
      });
    }

    if (onSuccess) {
      onSuccess();
    } else {
      toast.success(dict.global.success.savedSuccessfully);
    }
  };

  const [submitState, doSubmit] = useWrappedAsyncFn(onSubmit);

  return (
    <FormProvider {...formMethods}>
      <form
        onSubmit={formMethods.handleSubmit(doSubmit)}
        className="flex flex-col gap-4"
      >
        <FormInput
          label={dict.account.myInfo.phoneNumberLabel}
          name="phoneNumber"
          className="max-w-xs"
          type="tel"
          placeholder="+33 "
          options={{
            required: dict.global.forms.required,
          }}
        />
        <Separator />
        <h2 className="my-2 text-xl font-semibold">
          {dict.account.myInfo.negociationAgreement.title}
        </h2>
        <YesNoSelector
          label={dict.account.myInfo.negociationAgreement.openToNegoLabel}
          onChange={(value) => {
            formMethods.setValue('openToNegociation', value);
          }}
          value={watchOpenToNego}
        />
        {watchOpenToNego && (
          <>
            <FormInput
              label={
                dict.account.myInfo.negociationAgreement.maxAmountPercentLabel
              }
              name="maxAmountPercent"
              className="max-w-xs"
              type="number"
              options={{
                required: watchOpenToNego && dict.global.forms.required,
                max: 100,
              }}
              placeholder="20"
              renderIcon={() => (
                <p className="self-center text-sm font-semibold text-gray-700">
                  %
                </p>
              )}
            />
            <p>
              {
                dict.account.myInfo.negociationAgreement
                  .maxAmountPercentDescription
              }
            </p>
          </>
        )}
        <div className="">
          {submitState.error && (
            <p className="flex h-full items-center rounded-md border-2 border-rose-600 p-3 text-red-600">
              {dict.global.errors.unknownError}
            </p>
          )}
        </div>
        <Button
          className="flex w-[100px] justify-center self-start"
          type="submit"
        >
          {submitState.loading ? <Loader /> : dict.global.forms.submit}
        </Button>
      </form>
    </FormProvider>
  );
};

export default PersonalInfoForm;
