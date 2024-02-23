import {
  SyncedProductToUpdate,
  SyncLightProduct,
  SyncProduct,
  VariantStockToUpdate,
  VendorProduct,
} from '@modules/pro-vendor/domain/ports/types';

export interface ProVendorStrategy {
  getAllVendorProducts(
    sinceDate: Date | null | undefined,
  ): Promise<VendorProduct[]>;
  getProductsToUpdate(): Promise<SyncedProductToUpdate[]>;
  updateProductStocks(
    product: SyncedProductToUpdate,
    variantStockToUpdate: VariantStockToUpdate[],
  ): Promise<void>;
  getProductById(id: string): Promise<VendorProduct | null>;
  mapProduct(product: VendorProduct): Promise<SyncProduct | null>;
  mapLightProduct(product: VendorProduct): Promise<SyncLightProduct>;
  isUp(): Promise<boolean>;
}
