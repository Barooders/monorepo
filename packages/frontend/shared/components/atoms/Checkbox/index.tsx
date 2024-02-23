type PropsType = {
  label: string;
  checked: boolean;
  name: string;
  className?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const Checkbox: React.FC<PropsType> = ({
  label,
  checked,
  name,
  onChange,
  className,
}) => {
  return (
    <div className={`flex cursor-pointer items-center ${className}`}>
      <input
        id={name}
        type="checkbox"
        className="h-4 w-4 rounded border-gray-300 accent-red-500 focus:ring-2 focus:ring-red-300"
        checked={checked}
        onChange={onChange}
      />
      <label
        htmlFor={name}
        className="ml-2 text-sm text-gray-900"
      >
        {label}
      </label>
    </div>
  );
};

export default Checkbox;
