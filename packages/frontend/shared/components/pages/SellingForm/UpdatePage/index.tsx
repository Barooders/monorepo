'use client';

import Button from '@/components/atoms/Button';
import ErrorPanel from '@/components/atoms/ErrorPanel';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import useUser from '@/hooks/state/useUser';
import { getDictionary } from '@/i18n/translate';
import { ProductStatus } from '@/types';
import { useRouter } from 'next/navigation';
import React, { Fragment, useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';
import { HiLockClosed } from 'react-icons/hi2';
import SellingFormPageContainer from '../_components/SellingFormPageContainer';
import useFetchSellFormInformation from '../_hooks/useFetchSellFormInformation';
import useGetProductToUpdate from '../_hooks/useGetProductToUpdate';
import useCurrentStep from '../_state/useCurrentStep';
import useSellForm from '../_state/useSellForm';
import StepMenu from './StepMenu';
import Validation from './Validation';
import { formSteps } from './steps';

const dict = getDictionary('fr');

type PropsType = {
  productId: string;
  variantId?: string;
};

const UpdatePage: React.FC<PropsType> = ({ productId, variantId }) => {
  const [fetchState, doFetch] = useGetProductToUpdate();
  const { currentEditingStep, onStepPress, goBackToMenu } = useCurrentStep();
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
