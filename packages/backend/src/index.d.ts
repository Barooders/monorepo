export declare module '@medusajs/medusa/dist/models/product' {
  declare interface Product {
    store_id?: string;
  }
}

export declare module '@medusajs/medusa/dist/api/routes/admin/products/create-product' {
  declare interface AdminPostProductsReq {
    store_id?: string;
  }
}

export declare module '@medusajs/medusa/dist/types/product' {
  declare interface FilterableProductProps {
    store_id?: string;
  }
}
