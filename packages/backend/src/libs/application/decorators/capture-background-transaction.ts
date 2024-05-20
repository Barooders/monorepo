/* eslint-disable import/no-named-as-default-member */
import newrelic from 'newrelic';

export enum BackgroundTask {
  CLI = 'cli',
  CONSUMER = 'consumer',
}

export function CaptureBackgroundTransaction({
  name,
  type,
}: {
  name: string;
  type: BackgroundTask;
}) {
  return function (
    _target: Record<string, any>,
    _propertyKey: string,
    descriptor: TypedPropertyDescriptor<any>,
  ) {
    const methodToInstrument = descriptor.value;
    descriptor.value = async function (...args: any[]) {
      let result;
      const executeMethod = async () => {
        result = await methodToInstrument.apply(this, args);
      };
      await newrelic.startBackgroundTransaction(
        `${type}:${name}`,
        executeMethod,
      );
      return result;
    };
    return descriptor;
  };
}
