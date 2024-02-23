import Input from '@/components/molecules/FormInput';
import Loader from '@/components/atoms/Loader';
import { useCheckCustomerIdAvailability } from '@/hooks/useCheckCustomerIdAvailability';
import { getDictionary } from '@/i18n/translate';
import { useEffect, useState } from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';
import { ImCross } from 'react-icons/im';

const SellerNameInput: React.FC<{
  name: string;
}> = ({ name }) => {
  const dictionnary = getDictionary('fr');
  const [error, setError] = useState('');
  const [checkCustomerState, checkCustomerIdAvailability] =
    useCheckCustomerIdAvailability();

  useEffect(() => {
    if (checkCustomerState.error) {
      setError(checkCustomerState.error.message);
    }
    if (checkCustomerState.loading) {
      setError('');
    }
  }, [checkCustomerState.error, checkCustomerState.loading]);

  return (
    <Input
      label={dictionnary.signup.inputs.login.label}
      name={name}
      options={{
        required: dictionnary.global.forms.required,
        validate: (value) => checkCustomerIdAvailability(value),
      }}
      renderIcon={() =>
        checkCustomerState.loading ? (
          <Loader />
        ) : checkCustomerState.error ? (
          <ImCross />
        ) : checkCustomerState.value ? (
          <AiFillCheckCircle />
        ) : (
          <></>
        )
      }
      placeholder={dictionnary.lightSignup.inputs.login.placeholder}
      propsError={error}
    />
  );
};

export default SellerNameInput;
