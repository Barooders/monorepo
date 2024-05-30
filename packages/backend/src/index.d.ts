export declare module '@medusajs/medusa/dist/models/product' {
  declare interface Product {
    vendor_id?: string;
  }
}

export declare module '@medusajs/medusa/dist/api/routes/admin/products/create-product' {
  declare interface AdminPostProductsReq {
    vendor_id?: string;
  }
}
export declare module '@medusajs/medusa/dist/api/routes/admin/products/update-product' {
  declare interface AdminPostProductsProductReq {
    vendor_id?: string;
  }
}

export declare module '@medusajs/medusa/dist/types/product' {
  declare interface FilterableProductProps {
    vendor_id?: string;
  }
}
