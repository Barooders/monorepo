import { startBackgroundTransaction } from 'newrelic';

export function CaptureBackground() {
  return function (
    target: Record<string, any>,
    propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    const methodToInstrument = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      let result;
      const executeMethod = async () => {
        result = await methodToInstrument.apply(this, args);
      };
      await startBackgroundTransaction(propertyKey, executeMethod());
      return result;
    };
    return descriptor;
  };
}
