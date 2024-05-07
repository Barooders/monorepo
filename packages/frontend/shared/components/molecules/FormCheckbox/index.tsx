import Checkbox from '@/components/atoms/Checkbox';
import { HTMLInputTypeAttribute, memo } from 'react';
import { RegisterOptions, useFormContext } from 'react-hook-form';

type PropsType = {
  label?: string;
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  name: string;
  options?: RegisterOptions;
};

const FormCheckbox: React.FC<PropsType> = ({ name, options = {}, label }) => {
  const { register } = useFormContext();

  return (
    <Checkbox
      inputAdditionalProps={register(name, options)}
      name={name}
      label={label}
    ></Checkbox>
  );
};

export default memo(FormCheckbox);
