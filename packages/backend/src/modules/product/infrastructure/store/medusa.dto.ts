export interface CreateProductRequest {
  title: string;
  subtitle?: string;
  description?: string;
  is_giftcard?: boolean;
  discountable?: boolean;
  images: string[];
  thumbnail?: string;
  handle?: string;
  status?: 'draft' | 'published' | 'proposed' | 'rejected';
  type?: {
    id?: string;
    value: string;
  };
  collection_id?: string;
  tags?: {
    id?: string;
    value: string;
  };
}

export interface CreateProductResponse {
  product: Product;
}

export interface Product {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  title: string;
  subtitle: any;
  description: any;
  handle: string;
  is_giftcard: boolean;
  status: string;
  thumbnail: string;
  weight: any;
  length: any;
  height: any;
  width: any;
  hs_code: any;
  origin_country: any;
  mid_code: any;
  material: any;
  collection_id: any;
  type_id: any;
  discountable: boolean;
  external_id: any;
  metadata: any;
  categories: any[];
  collection: any;
  images: Image[];
  options: any[];
  profiles: Profile[];
  profile: Profile;
  profile_id: string;
  sales_channels: SalesChannel[];
  tags: any[];
  type: any;
  variants: any[];
}

export interface Image {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  url: string;
  metadata: any;
}

export interface Profile {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  name: string;
  type: string;
  metadata: any;
}

export interface SalesChannel {
  id: string;
  created_at: string;
  updated_at: string;
  deleted_at: any;
  name: string;
  description: string;
  is_disabled: boolean;
  metadata: any;
}
