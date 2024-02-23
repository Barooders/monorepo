'use client';

import React, { Fragment } from 'react';
import Button from '@/components/atoms/Button';
import { useRouter } from 'next/navigation';
import { getDictionary } from '@/i18n/translate';
import PageContainer from '@/components/atoms/PageContainer';

const dict = getDictionary('fr');
const validatedLabels = dict.sellingForm.validated;

const stepsData = [
  {
    icon: '⛺️',
    description: validatedLabels.validationSteps.quality,
  },
  {
    icon: '🏂',
    description: validatedLabels.validationSteps.state,
  },
  {
    icon: '📸',
    description: validatedLabels.validationSteps.pictures,
  },
];

const Validation = () => {
  const router = useRouter();
  const validationSteps = (
    icon: string,
    description: string,
    isFirst: boolean,
  ) => {
    return (
      <div className={`flex items-center ${isFirst ? '' : 'mt-5'}`}>
        <div className="mr-3 flex h-10 w-10 items-center justify-center rounded-lg bg-[#F4F5F6]">
          <p>{icon}</p>
        </div>
        <p className="text-secondary-content flex-1 text-base">{description}</p>
      </div>
    );
  };

  return (
    <PageContainer size="small">
      <div className="px-4 pb-6">
        <p className="mt-16 text-center text-xl font-bold">
          {validatedLabels.listingPublished}
        </p>
        <p className="text-secondary-content mt-2 text-center text-base">
          {validatedLabels.moderationTitle}
        </p>

        <div className="mx-4 mt-9">
          {stepsData.map(({ icon, description }, index) => (
            <Fragment key={index}>
              {validationSteps(icon, description, index === 0)}
            </Fragment>
          ))}
        </div>
        <div className="mt-10">
          <p className="text-secondary-content text-center text-base">
            {validatedLabels.findYourListing}
          </p>
          <div className="mt-2 flex-row items-center justify-center">
            <p className="text-secondary-content ml-1 text-center text-base font-bold">
              {validatedLabels.myShop}
            </p>
          </div>
        </div>
      </div>

      <div className="w-full">
        <Button onClick={() => router.push('/selling-form/create')}>
          {validatedLabels.addAnother}
        </Button>
      </div>
    </PageContainer>
  );
};

export default Validation;
