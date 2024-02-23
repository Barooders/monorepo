'use client';

import {
  HTMLInputTypeAttribute,
  InputHTMLAttributes,
  memo,
  useState,
} from 'react';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import InputElement from './_components/InputElement';

type PropsType = {
  label?: string;
  children?: React.ReactNode;
  type?: HTMLInputTypeAttribute;
  placeholder?: string;
  name: string;
  disabled?: boolean;
  renderIcon?: () => React.ReactNode;
  className?: string;
  inputAdditionalProps: InputHTMLAttributes<HTMLInputElement>;
  hasError?: boolean;
};

const Input: React.FC<PropsType> = ({
  label,
  children,
  type = 'text',
  placeholder,
  name,
  disabled,
  renderIcon,
  className = '',
  inputAdditionalProps,
  hasError = false,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <label
      html-for={name}
      className={`${className} flex flex-grow ${
        type === 'checkbox' ? 'flex-row items-start' : 'flex-col'
      }`}
    >
      <span
        className={`${
          type === 'checkbox' ? 'order-2' : ''
        } text-base font-semibold`}
      >
        {label || children}
      </span>
      <div
        className={`${type === 'checkbox' ? 'order-1 mr-2' : ''} relative mt-1`}
      >
        <InputElement
          inputProps={{
            id: name,
            disabled,
            placeholder,
            type: showPassword ? 'text' : type,
            className: `h-[35px] w-full rounded-md px-2 outline-none ${
              hasError ? 'border-2 border-rose-600' : 'border border-gray-200'
            }`,
          }}
          inputAdditionalProps={inputAdditionalProps}
        />
        {type === 'password' &&
          (showPassword ? (
            <FiEye
              onClick={() => setShowPassword(false)}
              className="absolute right-4 top-0 bottom-0 my-auto stroke-gray-400"
            />
          ) : (
            <FiEyeOff
              onClick={() => setShowPassword(true)}
              className="absolute right-4 top-0 bottom-0 my-auto stroke-gray-400"
            />
          ))}
        {renderIcon && (
          <div className="absolute right-4 top-0 bottom-0 flex items-center">
            {renderIcon()}
          </div>
        )}
      </div>
    </label>
  );
};

export default memo(Input);
