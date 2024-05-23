import { operations } from '@/__generated/rest-schema';
import useBackend from '@/hooks/useBackend';
import useWrappedAsyncFn from '@/hooks/useWrappedAsyncFn';
import { B2BCustomerRequestItemFormInputs } from '../B2BCustomerRequestItemForm';

const mapRequest = (
  requests: B2BCustomerRequestItemFormInputs[],
): operations['CustomerController_createCustomerRequests']['requestBody']['content']['application/json'] => {
  return {
    requests: requests.map((request) => ({
      ...request,
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      budgetMinInCents: request.minBudget ? request.minBudget * 100 : undefined,
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      budgetMaxInCents: request.maxBudget ? request.maxBudget * 100 : undefined,
      neededAtDate: new Date(request.neededAtDate).toISOString(),
    })),
  };
};

const useCreateRequest = () => {
  const { fetchAPI } = useBackend();

  return useWrappedAsyncFn(
    async (requests: B2BCustomerRequestItemFormInputs[]): Promise<boolean> => {
      await fetchAPI(`/v1/customers/requests`, {
        method: 'POST',
        body: JSON.stringify(mapRequest(requests)),
      });

      return true;
    },
  );
};

export default useCreateRequest;
