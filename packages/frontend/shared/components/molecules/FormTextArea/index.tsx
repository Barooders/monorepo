import TextArea from '@/components/atoms/TextArea';
import { HTMLInputTypeAttribute, memo } from 'react';
import { RegisterOptions, useFormContext, useFormState } from 'react-hook-form';

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

const FormTextarea: React.FC<PropsType> = ({
  name,
  options = {},
  children,
  className = '',
  disabled,
  label,
  placeholder,
  propsError,
}) => {
  const { register } = useFormContext();
  const { errors } = useFormState({ name });
  const error = errors[name];

  return (
    <div className={className}>
      <TextArea
        inputAdditionalProps={register(name, options)}
        hasError={!!error}
        name={name}
        disabled={disabled}
        label={label}
        placeholder={placeholder}
      >
        {children}
      </TextArea>
      <span className="text-sm text-red-600">
        {error?.message ? error.message.toString() : propsError ?? '\u00A0'}
      </span>
    </div>
  );
};

export default memo(FormTextarea);
