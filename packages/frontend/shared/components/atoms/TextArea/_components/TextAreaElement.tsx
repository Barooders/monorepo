import { TextareaHTMLAttributes, memo } from 'react';

type PropsType = {
  inputProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
  inputAdditionalProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
};

const TextAreaElement: React.FC<PropsType> = ({
  inputProps,
  inputAdditionalProps,
}) => (
  <textarea
    {...inputProps}
    {...inputAdditionalProps}
  />
);

export default memo(TextAreaElement);
