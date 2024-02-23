'use client';

import PersonalInfoForm from '@/components/molecules/PersonalInfoForm/container';
import { FormStepProps } from '../../../types';

const PersonalInfoStep: React.FC<FormStepProps> = () => {
  return (
    <div className="p-5">
      <PersonalInfoForm />
    </div>
  );
};

export default PersonalInfoStep;
