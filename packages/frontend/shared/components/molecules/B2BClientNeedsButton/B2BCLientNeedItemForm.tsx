import Input from '@/components/molecules/FormInput';
import FormTextArea from '@/components/molecules/FormTextArea';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type PropsType = {
  index: number;
};

const B2BClientNeedItemForm: React.FC<PropsType> = ({ index }) => {
  return (
    <div className="flex flex-col gap-2 rounded-lg border border-gray-300 px-3 py-2">
      <div className="text-base font-semibold">
        {dict.b2b.proPage.clientNeeds.form.need} {index}
      </div>
      <Input
        label={dict.b2b.proPage.clientNeeds.form.unitCount}
        name="unitCount"
        type="number"
        options={{
          required: dict.global.forms.required,
        }}
      />
      <FormTextArea
        label={dict.b2b.proPage.clientNeeds.form.specificities}
        name="specificity"
        type="text"
        options={{
          required: dict.global.forms.required,
        }}
      />
      <Input
        label={dict.b2b.proPage.clientNeeds.form.minBudget}
        name="minBudget"
        type="number"
      />
      <Input
        label={dict.b2b.proPage.clientNeeds.form.maxBudget}
        name="maxBudget"
        type="number"
      />
      <Input
        label={dict.b2b.proPage.clientNeeds.form.neededAtDate}
        name="neededAtDate"
        type="date"
      />
    </div>
  );
};

export default B2BClientNeedItemForm;
