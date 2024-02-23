import { ChangeEventHandler, useRef } from 'react';

type PropsType = {
  onImagesSelected: (image: FileReader['result'][]) => void;
  buttonComponent: React.ReactNode;
};

const FileInput: React.FC<PropsType> = ({
  onImagesSelected,
  buttonComponent,
}) => {
  const inputRef = useRef<HTMLInputElement>(null);

  // Handle the change event when a file is selected
  const handleOnChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    if (event.target.files && event.target.files.length > 0) {
      const dataURIs: FileReader['result'][] = [];
      for (const file of event.target.files) {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function () {
          dataURIs.push(reader.result);
          if (dataURIs.length === event.target.files?.length)
            onImagesSelected(dataURIs);
        };
      }
    }
  };

  const onChooseImg = () => {
    if (!inputRef.current) throw new Error('Input ref is not defined');
    inputRef.current.click();
  };

  return (
    <div>
      {/* Hidden file input element */}
      <input
        type="file"
        accept="image/*"
        multiple
        ref={inputRef}
        onChange={handleOnChange}
        style={{ display: 'none' }}
      />

      <div onClick={onChooseImg}>{buttonComponent}</div>
    </div>
  );
};

export default FileInput;
