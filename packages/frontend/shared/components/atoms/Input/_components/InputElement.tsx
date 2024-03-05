import { InputHTMLAttributes, memo } from 'react';

type PropsType = {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputAdditionalProps: InputHTMLAttributes<HTMLInputElement>;
};

const InputElement: React.FC<PropsType> = ({
  inputProps,
  inputAdditionalProps,
}) => (
  <input
    {...inputProps}
    {...inputAdditionalProps}
  />
);

export default memo(InputElement);
