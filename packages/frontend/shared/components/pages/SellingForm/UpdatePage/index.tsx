'use client';

import Button from '@/components/atoms/Button';
import ErrorPanel from '@/components/atoms/ErrorPanel';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
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
  productInternalId: string;
};

const UpdatePage: React.FC<PropsType> = ({ productInternalId }) => {
  const [fetchState, doFetch] = useGetProductToUpdate();
  const { currentEditingStep, onStepPress, goBackToMenu } = useCurrentStep();
  const [showPublicationMessage, setShowPublicationMessage] =
    useState<boolean>(false);
  const [, doFetchSellInformation] = useFetchSellFormInformation();
  const { isStepValidated, sellFormConfig, productInfos } = useSellForm();
  const router = useRouter();

  useEffect(() => {
    doFetch(productInternalId);
    if (!sellFormConfig) {
      doFetchSellInformation();
    }
  }, [productInternalId]);

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
          <CurrentEditingStepComponent productInternalId={productInternalId} />

          {!currentStep?.hideValidateButton && (
            <div className="mt-2 w-full p-5">
              <Button
                disabled={!isStepValidated(currentEditingStep.name)}
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
          productInternalId={productInternalId}
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
