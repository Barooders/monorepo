'use client';

import { TextareaHTMLAttributes, memo } from 'react';
import TextAreaElement from './_components/TextAreaElement';

type PropsType = {
  label?: string;
  children?: React.ReactNode;
  placeholder?: string;
  name: string;
  disabled?: boolean;
  renderIcon?: () => React.ReactNode;
  className?: string;
  inputAdditionalProps: TextareaHTMLAttributes<HTMLTextAreaElement>;
  hasError?: boolean;
};

const Input: React.FC<PropsType> = ({
  label,
  children,
  placeholder,
  name,
  disabled,
  className = '',
  inputAdditionalProps,
  hasError = false,
}) => {
  return (
    <label
      html-for={name}
      className={`${className} flex flex-grow flex-col`}
    >
      <span className="text-base font-semibold">{label || children}</span>
      <div className="relative mt-1">
        <TextAreaElement
          inputProps={{
            id: name,
            disabled,
            placeholder,
            className: `h-[100px] w-full rounded-md px-2 outline-none ${
              hasError ? 'border-2 border-rose-600' : 'border border-gray-200'
            }`,
          }}
          inputAdditionalProps={inputAdditionalProps}
        />
      </div>
    </label>
  );
};

export default memo(Input);
