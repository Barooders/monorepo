import {
  useApplyAttributeChange,
  useAttributes,
} from '@shopify/ui-extensions-react/checkout';

const useCheckoutAttribute = (
  attributeKey: string,
): [value: string, (newValue: string) => void] => {
  const attributes = useAttributes();
  const applyAttributeChange = useApplyAttributeChange();

  const currentValue = attributes.find(
    (attribute) => attribute.key === attributeKey,
  )?.value as string;

  const updateValue = (newValue: string) => {
    applyAttributeChange({
      type: 'updateAttribute',
      key: attributeKey,
      value: newValue,
    });
  };

  return [currentValue, updateValue];
};

export default useCheckoutAttribute;
