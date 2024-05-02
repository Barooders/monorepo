import Input from '@/components/molecules/FormInput';
import FormTextArea from '@/components/molecules/FormTextArea';
import { getDictionary } from '@/i18n/translate';

const dict = getDictionary('fr');

type PropsType = {
  index: number;
};

export type B2BClientRequestItemFormInputs = {
  unitCount: number;
  specificity: string;
  minBudget?: number;
  maxBudget?: number;
  neededAtDate: string;
};

const FIELD_ARRAY_NAME = 'requests';

const B2BClientRequestItemForm: React.FC<PropsType> = ({ index }) => {
  return (
    <div className="mb-4 flex flex-col gap-2 rounded-lg border border-gray-300 px-3 py-2">
      <div className="text-base font-semibold">
        {dict.b2b.proPage.clientRequests.form.need} {index + 1}
      </div>
      <Input
        label={dict.b2b.proPage.clientRequests.form.unitCount}
        name={`${FIELD_ARRAY_NAME}.${index}.unitCount`}
        type="number"
        options={{
          required: dict.global.forms.required,
        }}
      />
      <FormTextArea
        label={dict.b2b.proPage.clientRequests.form.specificities}
        name={`${FIELD_ARRAY_NAME}.${index}.specificity`}
        type="text"
        options={{
          required: dict.global.forms.required,
        }}
      />
      <Input
        label={dict.b2b.proPage.clientRequests.form.minBudget}
        name={`${FIELD_ARRAY_NAME}.${index}.minBudget`}
        type="number"
      />
      <Input
        label={dict.b2b.proPage.clientRequests.form.maxBudget}
        name={`${FIELD_ARRAY_NAME}.${index}.maxBudget`}
        type="number"
      />
      <Input
        label={dict.b2b.proPage.clientRequests.form.neededAtDate}
        name={`${FIELD_ARRAY_NAME}.${index}.neededAtDate`}
        type="date"
      />
    </div>
  );
};

export default B2BClientRequestItemForm;
