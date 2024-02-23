import { PIMProductType } from '@libs/domain/types';

export abstract class IPIMClient {
  abstract getPimProductType(productType: string): Promise<PIMProductType>;
  abstract checkIfProductTypeExists(productType: string): Promise<void>;
}
