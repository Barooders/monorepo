import DescriptionStep from './DescriptionStep';
import ImagesStep from './ImagesStep';
import InformationStep from './InformationStep';
import { getDictionary } from '@/i18n/translate';
import { FormStepType, SellFormSteps } from '../../types';
import ConditionAndPriceStep from './ConditionAndPriceStep';
import PersonalInfoStep from './PersonalInfoStep';

const dict = getDictionary('fr');

export const formSteps: FormStepType[] = [
  {
    name: SellFormSteps.PRODUCT_INFOS,
    title: dict.sellingForm.informationStep.stepTitle,
    component: InformationStep,
  },
  {
    name: SellFormSteps.PICTURES,
    title: dict.sellingForm.imageStep.stepTitle,
    component: ImagesStep,
  },
  {
    name: SellFormSteps.DESCRIPTION,
    title: dict.sellingForm.descriptionStep.stepTitle,
    component: DescriptionStep,
  },
  {
    name: SellFormSteps.CONDITION_AND_PRICE,
    title: dict.sellingForm.conditionAndPriceStep.stepTitle,
    component: ConditionAndPriceStep,
  },
  {
    name: SellFormSteps.VENDOR,
    title: dict.sellingForm.personalInfoStep.stepTitle,
    component: PersonalInfoStep,
    hideValidateButton: true,
  },
];
