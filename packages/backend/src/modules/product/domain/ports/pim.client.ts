import { PIMProductType, PimProductModel } from '@libs/domain/types';
import { CreateProductModel } from '../types';

export abstract class IPIMClient {
  abstract getPimProductType(productType: string): Promise<PIMProductType>;
  abstract isBike(productType: string): Promise<boolean>;
  abstract checkIfProductTypeExists(productType: string): Promise<void>;
  abstract createProductModel(
    model: CreateProductModel,
  ): Promise<PimProductModel>;
}
