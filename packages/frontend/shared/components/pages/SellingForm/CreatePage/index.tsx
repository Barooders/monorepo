'use client';

import Callout, { CalloutTypes } from '@/components/atoms/Callout';
import Loader from '@/components/atoms/Loader';
import PageContainer from '@/components/atoms/PageContainer';
import { getDictionary } from '@/i18n/translate';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import useCreateProduct from '../_hooks/useCreateProduct';
import useFetchSellFormInformation from '../_hooks/useFetchSellFormInformation';
import ProductTypeSearch from './ProductTypeSearch';
import SelectBrand from './SelectBrand';
import SelectModel from './SelectModel';

const dict = getDictionary('fr');

enum CreateProductSteps {
  PRODUCT_TYPE = 'PRODUCT_TYPE',
  BRAND = 'BRAND',
  MODEL = 'MODEL',
}

const CreatePage = () => {
  const [state, doFetch] = useFetchSellFormInformation();
  const [currentStep, setCurrentStep] = useState<CreateProductSteps>(
    CreateProductSteps.PRODUCT_TYPE,
  );
  const router = useRouter();

  const [createState, doCreate] = useCreateProduct();

  useEffect(() => {
    doFetch();
  }, []);

  useEffect(() => {
    if (createState.value) {
      router.push(`/selling-form/${createState.value}`);
    }
  }, [createState.value]);

  const isLoading = state.loading || createState.loading || createState.value;
  const hasError = !isLoading && (state.error || createState.error);

  if (isLoading) return <Loader />;

  return (
    <PageContainer size="medium">
      {hasError && (
        <Callout
          content={dict.global.errors.unknownError}
          type={CalloutTypes.ERROR}
        />
      )}
      {!state.loading &&
        (currentStep === CreateProductSteps.PRODUCT_TYPE ? (
          <ProductTypeSearch
            onSelect={() => setCurrentStep(CreateProductSteps.BRAND)}
          />
        ) : currentStep === CreateProductSteps.BRAND ? (
          <SelectBrand
            onGoBack={() => setCurrentStep(CreateProductSteps.PRODUCT_TYPE)}
            onSelect={() => setCurrentStep(CreateProductSteps.MODEL)}
          />
        ) : currentStep === CreateProductSteps.MODEL ? (
          <SelectModel
            onGoBack={() => setCurrentStep(CreateProductSteps.BRAND)}
            onSelect={doCreate}
          />
        ) : null)}
    </PageContainer>
  );
};

export default CreatePage;
