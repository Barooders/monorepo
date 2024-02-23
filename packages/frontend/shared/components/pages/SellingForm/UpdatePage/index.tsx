'use client';

import React, { Fragment, useEffect, useState } from 'react';
import { FormStepType } from '../types';
import StepMenu from './StepMenu';
import { formSteps } from './steps';
import useGetProductToUpdate from '../_hooks/useGetProductToUpdate';
import Loader from '@/components/atoms/Loader';
import Button from '@/components/atoms/Button';
import useSellForm from '../_state/useSellForm';
import { getDictionary } from '@/i18n/translate';
import { useRouter } from 'next/navigation';
import ErrorPanel from '@/components/atoms/ErrorPanel';
import { HiLockClosed } from 'react-icons/hi2';
import Validation from './Validation';
import { toast } from 'react-hot-toast';
import { ProductStatus } from '@/types';
import SellingFormPageContainer from '../_components/SellingFormPageContainer';
import useFetchSellFormInformation from '../_hooks/useFetchSellFormInformation';
import PageContainer from '@/components/atoms/PageContainer';
import useUser from '@/hooks/state/useUser';

const dict = getDictionary('fr');

type PropsType = {
  productId: string;
  variantId?: string;
};

const UpdatePage: React.FC<PropsType> = ({ productId, variantId }) => {
  const [fetchState, doFetch] = useGetProductToUpdate();
  const [currentEditingStep, setCurrentEditingStep] =
    useState<FormStepType | null>(null);
  const [showPublicationMessage, setShowPublicationMessage] =
    useState<boolean>(false);
  const [, doFetchSellInformation] = useFetchSellFormInformation();
  const { isStepValidated, sellFormConfig, productInfos } = useSellForm();
  const router = useRouter();
  const { hasuraToken } = useUser();

  useEffect(() => {
    doFetch(productId, variantId);
    if (!sellFormConfig) {
      doFetchSellInformation();
    }
  }, [productId, variantId]);

  const onStepPress = (item: FormStepType) => {
    setCurrentEditingStep(item);
    window.scrollTo({ top: 0, left: 0 });
  };

  const goBackToMenu = () => {
    setCurrentEditingStep(null);
    window.scrollTo({ top: 0, left: 0 });
  };

  const currentStep = formSteps.find(
    (formStep) => formStep.name === currentEditingStep?.name,
  );

  const CurrentEditingStepComponent = currentStep?.component ?? Fragment;

  return (
    <PageContainer size="medium">
      {fetchState.loading ? (
        <Loader />
      ) : fetchState.error ? (
        <ErrorPanel
          Icon={(props) => <HiLockClosed {...props} />}
          title={dict.global.errors.title}
          description={dict.global.errors.unauthorized}
        />
      ) : currentEditingStep !== null ? (
        <SellingFormPageContainer
          title={currentEditingStep.title}
          onGoBack={goBackToMenu}
        >
          <CurrentEditingStepComponent productId={productId} />

          {!currentStep?.hideValidateButton && (
            <div className="mt-2 w-full p-5">
              <Button
                disabled={
                  !isStepValidated(currentEditingStep.name, hasuraToken?.user)
                }
                onClick={goBackToMenu}
                className="w-full"
              >
                {dict.sellingForm.validate}
              </Button>
            </div>
          )}
        </SellingFormPageContainer>
      ) : showPublicationMessage ? (
        <Validation />
      ) : (
        <StepMenu
          productId={productId}
          isLoading={fetchState.loading}
          onStepPress={onStepPress}
          onValidate={() => {
            if (productInfos.status !== ProductStatus.ACTIVE) {
              setShowPublicationMessage(true);
            } else {
              toast.success(dict.global.success.savedSuccessfully);
              router.replace('/account/catalog?tab=onlineProducts');
            }
          }}
        />
      )}
    </PageContainer>
  );
};

export default UpdatePage;
