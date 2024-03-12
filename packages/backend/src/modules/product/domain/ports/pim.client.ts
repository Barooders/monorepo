import { PIMProductType } from '@libs/domain/types';

export abstract class IPIMClient {
  abstract getPimProductType(productType: string): Promise<PIMProductType>;
  abstract isBike(productType: string): Promise<boolean>;
  abstract checkIfProductTypeExists(productType: string): Promise<void>;
}
