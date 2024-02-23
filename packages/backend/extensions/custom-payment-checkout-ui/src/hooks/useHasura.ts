import { useSettings } from '@shopify/ui-extensions-react/checkout';

const useHasura = () => {
  const settings = useSettings();

  return async <ResponseType, VariablesType = Record<string, unknown>>(
    query: string,
    { variables, headers }: { variables?: VariablesType; headers?: Headers },
  ): Promise<ResponseType> => {
    const promise = fetch(`${settings.hasura_base_url.toString()}/v1/graphql`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query, variables }),
    });

    const result = await promise;

    const { data, errors } = await result.json();

    if (errors) {
      throw errors;
    }

    return data;
  };
};

export default useHasura;
