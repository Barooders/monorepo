import {
  PIMProductModel,
  PIMProductType,
  ProductModel,
} from '@libs/domain/types';
import { CreateProductModel } from '../types';

export abstract class IPIMClient {
  abstract getPimProductType(productType: string): Promise<PIMProductType>;
  abstract getPimProductModel(productModel: string): Promise<PIMProductModel>;
  abstract isBike(productType: string): Promise<boolean>;
  abstract checkIfProductTypeExists(productType: string): Promise<void>;
  abstract createProductModel(model: CreateProductModel): Promise<ProductModel>;
}
