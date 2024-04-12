import productionConfig from './production';
import { EnvironmentsType } from './types';

const localConfig: EnvironmentsType = {
  s3: productionConfig.s3,
};

export default localConfig;
