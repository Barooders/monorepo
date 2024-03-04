'use client';

import WrappedPersonalInfoForm from '@/components/molecules/PersonalInfoForm/container';
import useCurrentStep from '../../../_state/useCurrentStep';
import { FormStepProps } from '../../../types';

const PersonalInfoStep: React.FC<FormStepProps> = () => {
  const { goBackToMenu } = useCurrentStep();

  return (
    <div className="p-5">
      <WrappedPersonalInfoForm onSuccess={goBackToMenu} />
    </div>
  );
};

export default PersonalInfoStep;
