import Input from '@/components/molecules/FormInput';
import FormTextArea from '@/components/molecules/FormTextArea';
import { getDictionary } from '@/i18n/translate';
import { ImCross } from 'react-icons/im';

const dict = getDictionary('fr');

type PropsType = {
  index: number;
  remove: () => void;
};

export type B2BCustomerRequestItemFormInputs = {
  quantity: number;
  description: string;
  minBudget?: number;
  maxBudget?: number;
  neededAtDate: string;
};

const FIELD_ARRAY_NAME = 'requests';

const B2BCustomerRequestItemForm: React.FC<PropsType> = ({ index, remove }) => {
  return (
    <div className="mb-2 flex flex-col gap-2 rounded-lg border border-gray-300 px-3 py-2">
      <div className="flex justify-between">
        <span className="text-base font-semibold">
          {dict.b2b.proPage.customerRequests.form.need} {index + 1}
        </span>
        {index !== 0 ? (
          <ImCross
            size={25}
            className='hover:text-gray-900" cursor-pointer rounded-lg bg-transparent p-1.5 text-sm text-gray-400 hover:bg-gray-200'
            onClick={remove}
          />
        ) : (
          <></>
        )}
      </div>
      <Input
        label={dict.b2b.proPage.customerRequests.form.quantity}
        name={`${FIELD_ARRAY_NAME}.${index}.quantity`}
        type="number"
        options={{
          required: dict.global.forms.required,
        }}
        inputClassName="gap-2 items-center"
        inline
      />
      <FormTextArea
        label={dict.b2b.proPage.customerRequests.form.description}
        name={`${FIELD_ARRAY_NAME}.${index}.description`}
        type="text"
        options={{
          required: dict.global.forms.required,
        }}
        placeholder="Marque, modèle, année, usage, etc."
      />

      <div className="flex justify-between">
        <Input
          label={dict.b2b.proPage.customerRequests.form.minBudget}
          name={`${FIELD_ARRAY_NAME}.${index}.minBudget`}
          type="number"
          className="mr-4 w-full"
        />
        <Input
          label={dict.b2b.proPage.customerRequests.form.maxBudget}
          name={`${FIELD_ARRAY_NAME}.${index}.maxBudget`}
          type="number"
          className="w-full"
        />
      </div>

      <Input
        label={dict.b2b.proPage.customerRequests.form.neededAtDate}
        name={`${FIELD_ARRAY_NAME}.${index}.neededAtDate`}
        type="date"
        inputClassName="gap-2 items-center"
        inline
      />
    </div>
  );
};

export default B2BCustomerRequestItemForm;
