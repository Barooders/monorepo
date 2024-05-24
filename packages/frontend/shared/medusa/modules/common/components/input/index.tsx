import { Label } from '@medusajs/ui';
import React, { useEffect, useImperativeHandle, useState } from 'react';

import Eye from '@/medusa/modules/common/icons/eye';
import EyeOff from '@/medusa/modules/common/icons/eye-off';

type InputProps = Omit<
  Omit<React.InputHTMLAttributes<HTMLInputElement>, 'size'>,
  'placeholder'
> & {
  label: string;
  errors?: Record<string, unknown>;
  name: string;
  topLabel?: string;
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type, name, label, required, topLabel, ...props }, ref) => {
    const inputRef = React.useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);
    const [inputType, setInputType] = useState(type);

    useEffect(() => {
      if (type === 'password' && showPassword) {
        setInputType('text');
      }

      if (type === 'password' && !showPassword) {
        setInputType('password');
      }
    }, [type, showPassword]);

    useImperativeHandle(ref, () => inputRef.current!);

    return (
      <div className="flex w-full flex-col">
        {topLabel && (
          <Label className="txt-compact-medium-plus mb-2">{topLabel}</Label>
        )}
        <div className="txt-compact-medium relative z-0 flex w-full">
          <input
            type={inputType}
            name={name}
            placeholder=" "
            required={required}
            className="bg-ui-bg-field focus:shadow-borders-interactive-with-active border-ui-border-base hover:bg-ui-bg-field-hover mt-0 block h-11 w-full appearance-none rounded-md border px-4 pb-1 pt-4 focus:outline-none focus:ring-0"
            {...props}
            ref={inputRef}
          />
          <label
            htmlFor={name}
            onClick={() => inputRef.current?.focus()}
            className="-z-1 origin-0 text-ui-fg-subtle absolute top-3 mx-3 flex items-center justify-center px-1 transition-all duration-300"
          >
            {label}
            {required && <span className="text-rose-500">*</span>}
          </label>
          {type === 'password' && (
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="text-ui-fg-subtle focus:text-ui-fg-base absolute right-0 top-3 px-4 outline-none transition-all duration-150 focus:outline-none"
            >
              {showPassword ? <Eye /> : <EyeOff />}
            </button>
          )}
        </div>
      </div>
    );
  },
);

Input.displayName = 'Input';

export default Input;
