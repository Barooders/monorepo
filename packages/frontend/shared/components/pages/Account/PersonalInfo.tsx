'use client';

import PageContainer from '@/components/atoms/PageContainer';
import PersonalInfoForm from '@/components/molecules/PersonalInfoForm/container';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

const PersonalInfo: React.FC = () => {
  return (
    <PageContainer size="medium">
      <div className="flex flex-col gap-5 p-5">
        <h1 className="mb-3 text-3xl font-semibold">
          {dict.account.myInfo.title}
        </h1>
        <PersonalInfoForm />
      </div>
    </PageContainer>
  );
};

export default PersonalInfo;
