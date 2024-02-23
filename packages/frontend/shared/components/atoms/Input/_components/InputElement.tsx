import { InputHTMLAttributes, memo } from 'react';
import InputMask from 'react-input-mask';

type PropsType = {
  inputProps: InputHTMLAttributes<HTMLInputElement>;
  inputAdditionalProps: InputHTMLAttributes<HTMLInputElement>;
};

const InputElement: React.FC<PropsType> = ({
  inputProps,
  inputAdditionalProps,
}) =>
  inputProps.type === 'tel' ? (
    <InputMask
      mask="+99 9 99 99 99 99"
      maskChar={null}
      {...inputProps}
      {...inputAdditionalProps}
    />
  ) : (
    <input
      {...inputProps}
      {...inputAdditionalProps}
    />
  );

export default memo(InputElement);
