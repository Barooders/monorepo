import { COMMISSION_PRODUCT_TYPE } from '@/config';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { useEffect } from 'react';
import ProductCard from '.';
import { ContainerPropsType, getData } from './container';

export const ProductCardWithContainer: React.FC<ContainerPropsType> = (
  containerProps,
) => {
  const [{ value }, doGetData] = useWrappedAsyncFn(getData);
  const intent = containerProps.intent ?? 'card';

  useEffect(() => {
    doGetData(containerProps);
  }, [containerProps.productId]);

  return (
    <>
      {value && value.productType !== COMMISSION_PRODUCT_TYPE && (
        <ProductCard
          {...value}
          intent={intent}
        />
      )}
    </>
  );
};
