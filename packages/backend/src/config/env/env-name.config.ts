import { get } from 'env-var';
import { Environments } from './types';

const baroodersEnv = get('BAROODERS_ENV').required().asString() as Environments;

export const envName = Object.values(Environments).includes(baroodersEnv)
  ? baroodersEnv
  : Environments.STAGING;
