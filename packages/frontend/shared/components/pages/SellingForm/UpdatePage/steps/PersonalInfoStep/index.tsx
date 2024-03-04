'use client';

import PersonalInfoForm from '@/components/molecules/PersonalInfoForm/container';
import useCurrentStep from '../../../_state/useCurrentStep';
import { FormStepProps } from '../../../types';

const PersonalInfoStep: React.FC<FormStepProps> = () => {
  const { goBackToMenu } = useCurrentStep();

  return (
    <div className="p-5">
      <PersonalInfoForm onSuccess={goBackToMenu} />
    </div>
  );
};

export default PersonalInfoStep;
