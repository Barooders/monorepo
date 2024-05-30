import { registerOverriddenValidators } from '@medusajs/medusa';
import { AdminPostProductsReq as MedusaAdminPostProductsReq } from '@medusajs/medusa/dist/api/routes/admin/products/create-product';
import { AdminGetProductsParams as MedusaAdminGetProductsParams } from '@medusajs/medusa/dist/api/routes/admin/products/list-products';
import { IsString } from 'class-validator';

class AdminPostProductsReq extends MedusaAdminPostProductsReq {
  @IsString()
  store_id: string;
}

registerOverriddenValidators(AdminPostProductsReq);

class AdminGetProductsParams extends MedusaAdminGetProductsParams {
  @IsString()
  store_id: string;
}

registerOverriddenValidators(AdminGetProductsParams);
