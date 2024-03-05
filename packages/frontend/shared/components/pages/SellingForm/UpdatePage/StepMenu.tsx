import Button from '@/components/atoms/Button';
import Callout, { CalloutTypes } from '@/components/atoms/Callout';
import Loader from '@/components/atoms/Loader';
import usePersonalInfoForm from '@/components/molecules/PersonalInfoForm/_state/usePersonalInfoForm';
import { getDictionary } from '@/i18n/translate';
import { useEffect } from 'react';
import { MdCheck } from 'react-icons/md';
import SellingFormLine from '../_components/SellingFormLine';
import SellingFormPageContainer from '../_components/SellingFormPageContainer';
import useUpdateProduct from '../_hooks/useUpdateProduct';
import useSellForm from '../_state/useSellForm';
import { FormStepType } from '../types';
import { formSteps } from './steps';

const dict = getDictionary('fr');

type PropsType = {
  productId: string;
  onStepPress: (item: FormStepType) => void;
  isLoading: boolean;
  onValidate: () => void;
};

const StepMenu: React.FC<PropsType> = ({
  productId,
  onStepPress,
  isLoading,
  onValidate,
}) => {
  const { productInfos, isStepValidated } = useSellForm();
  const [updateState, doUpdate] = useUpdateProduct();
  const { phoneNumber } = usePersonalInfoForm();

  const getStepCompleted = () => {
    return formSteps
      .map(({ name }) => name)
      .filter((stepName) => isStepValidated(stepName, phoneNumber));
  };

  const nbStepToComplete = formSteps.length - getStepCompleted().length;
  const canSave = nbStepToComplete === 0 && !isLoading;

  const submitForm = () => {
    if (!productInfos.variantId) throw new Error('Missing variant id');
    doUpdate(productId, productInfos.variantId);
  };

  useEffect(() => {
    if (updateState.value) {
      onValidate();
    }
  }, [updateState.value]);

  return (
    <SellingFormPageContainer
      title={dict.sellingForm.updateMainTitle}
      subtitle={`${nbStepToComplete} ${dict.sellingForm.stepToComplete(
        nbStepToComplete > 0,
      )}`}
    >
      <div className="my-5 flex flex-row items-center px-3">
        <img
          src={productInfos?.images?.[0]?.src}
          className="h-[60px] w-[60px] items-center justify-center rounded-lg bg-[#F4F5F6]"
        />
        <div className="ml-3 flex-1 justify-center">
          <p className="text-base font-bold uppercase">{`${
            productInfos?.brand
          }${productInfos?.model ? ` - ${productInfos?.model}` : ''}`}</p>
          <p className="text-sm">{productInfos?.type}</p>
        </div>
      </div>
      <div className="flex flex-col">
        {formSteps.map((step, index) => (
          <SellingFormLine
            onClick={() => onStepPress(step)}
            key={step.name}
          >
            <div className="flex items-center gap-3">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full ${
                  isStepValidated(step.name, phoneNumber)
                    ? 'bg-primary-400'
                    : 'bg-gray-200'
                }`}
              >
                {isStepValidated(step.name, phoneNumber) ? (
                  <MdCheck className="text-white" />
                ) : (
                  index + 1
                )}
              </div>
              {step.title}
            </div>
          </SellingFormLine>
        ))}
      </div>
      <div className="mt-3 flex w-full flex-col gap-3 px-3 py-3">
        {updateState.error && (
          <Callout
            type={CalloutTypes.ERROR}
            content={dict.global.errors.unknownError}
          />
        )}
        <Button
          disabled={!canSave}
          onClick={submitForm}
          className="flex w-full items-center justify-center"
        >
          {updateState.loading ? <Loader /> : dict.sellingForm.validate}
        </Button>
        {canSave && (
          <Callout
            type={CalloutTypes.INFO}
            title={dict.sellingForm.updateLatencyTitle}
            content={dict.sellingForm.updateLatencyDescription}
          />
        )}
      </div>
    </SellingFormPageContainer>
  );
};

export default StepMenu;
