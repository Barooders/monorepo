import { getDictionary } from '@/i18n/translate';
import { RegisterOptions, useFormContext, useFormState } from 'react-hook-form';
import Input from '@/components/atoms/Input';
import { isValidPhoneNumber } from 'libphonenumber-js';
import { HTMLInputTypeAttribute, memo } from 'react';

const dict = getDictionary('fr');

type PropsType = {
  label?: string;
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  name: string;
  options?: RegisterOptions;
  disabled?: boolean;
  renderIcon?: () => React.ReactNode;
  propsError?: string;
  className?: string;
};

const FormInput: React.FC<PropsType> = ({
  name,
  type = 'text',
  options = {},
  children,
  className = '',
  disabled,
  label,
  renderIcon,
  placeholder,
  propsError,
}) => {
  const { register } = useFormContext();
  const { errors } = useFormState({ name });
  const labels = getDictionary('fr');
  const error = errors[name];

  if (type === 'password') {
    options.minLength = {
      value: 8,
      message: labels.global.forms.passwordIsTooShort,
    };
  }

  if (type === 'email') {
    options.pattern = {
      value: /\S+@\S+\.\S+/,
      message: labels.global.forms.emailNotValid,
    };
  }

  if (type === 'tel') {
    options.validate = (v: string) => {
      if (!v) return true;

      try {
        return isValidPhoneNumber(v)
          ? undefined
          : dict.global.forms.phoneNumberInvalid;
      } catch (e) {
        console.error(e);
        return false;
      }
    };
  }

  if (type === 'number') {
    options.valueAsNumber = true;
  }

  return (
    <div className={className}>
      <Input
        inputAdditionalProps={register(name, options)}
        hasError={!!error}
        name={name}
        disabled={disabled}
        label={label}
        renderIcon={renderIcon}
        placeholder={placeholder}
        type={type}
      >
        {children}
      </Input>
      <span className="text-sm text-red-600">
        {error?.message ? error.message.toString() : propsError ?? '\u00A0'}
      </span>
    </div>
  );
};

export default memo(FormInput);
