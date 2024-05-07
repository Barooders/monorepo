import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class ProductDTO {
  @IsNumber()
  @IsOptional()
  id?: number;

  @IsNumber()
  @IsOptional()
  id_manufacturer?: number;

  @IsString()
  @IsOptional()
  manufacturer_name?: string;

  @IsNumber()
  @IsOptional()
  id_supplier?: number;

  @IsNumber()
  @IsOptional()
  id_category_default?: number;

  @IsNumber()
  @IsOptional()
  new?: number;

  @IsNumber()
  @IsOptional()
  cache_default_attribute?: number;

  @IsNumber()
  @IsOptional()
  id_default_image?: number;

  @IsNumber()
  @IsOptional()
  id_default_combination?: number;

  @IsNumber()
  @IsOptional()
  id_tax_rules_group?: number;

  @IsNumber()
  @IsOptional()
  position_in_category?: number;

  @IsString()
  @IsOptional()
  type?: string;

  @IsNumber()
  @IsOptional()
  id_shop_default?: number;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  supplier_reference?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsNumber()
  @IsOptional()
  width?: number;

  @IsNumber()
  @IsOptional()
  height?: number;

  @IsNumber()
  @IsOptional()
  depth?: number;

  @IsString()
  @IsOptional()
  weight?: string;

  @IsString()
  @IsOptional()
  quantity_discount?: string;

  @IsString()
  @IsOptional()
  ean13?: string;

  @IsString()
  @IsOptional()
  isbn?: string;

  @IsString()
  @IsOptional()
  upc?: string;

  @IsString()
  @IsOptional()
  mpn?: string;

  @IsBoolean()
  @IsOptional()
  cache_is_pack?: boolean;

  @IsBoolean()
  @IsOptional()
  cache_has_attachments?: boolean;

  @IsBoolean()
  @IsOptional()
  is_virtual?: boolean;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  additional_delivery_times?: string;

  @IsString({ each: true })
  @IsOptional()
  delivery_in_stock?: string[];

  @IsBoolean()
  @IsOptional()
  on_sale?: boolean;

  @IsBoolean()
  @IsOptional()
  online_only?: boolean;

  @IsString()
  @IsOptional()
  ecotax?: string;

  @IsNumber()
  @IsOptional()
  minimal_quantity?: number;

  @IsNumber()
  @IsOptional()
  low_stock_threshold?: number;

  @IsBoolean()
  @IsOptional()
  low_stock_alert?: boolean;

  @IsString()
  @IsOptional()
  price?: string;

  @IsString()
  @IsNotEmpty()
  price_on_sale!: string;

  @IsString()
  @IsNotEmpty()
  price_old!: string;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsString()
  @IsOptional()
  wholesale_price?: string;

  @IsString()
  @IsOptional()
  unity?: string;

  @IsString()
  @IsOptional()
  unit_price_ratio?: string;

  @IsString()
  @IsOptional()
  additional_shipping_cost?: string;

  @IsBoolean()
  @IsOptional()
  customizable?: boolean;

  @IsOptional()
  @IsString()
  text_fields?: string;

  @IsOptional()
  @IsString()
  uploadable_files?: string;

  @IsOptional()
  @IsString({
    groups: ['0', '1'],
  })
  active?: string;

  @IsOptional()
  @IsString()
  redirect_type?: string;

  @IsOptional()
  @IsString()
  id_type_redirected?: string;

  @IsOptional()
  @IsString({
    groups: ['0', '1'],
  })
  available_for_order?: string;

  @IsOptional()
  @IsString()
  available_date?: string;

  @IsOptional()
  @IsBoolean()
  show_condition?: boolean;

  @IsOptional()
  @IsString()
  condition?: string;

  @IsOptional()
  @IsBoolean()
  show_price?: boolean;

  @IsOptional()
  @IsBoolean()
  indexed?: boolean;

  @IsOptional()
  @IsString()
  visibility?: string;

  @IsOptional()
  @IsBoolean()
  advanced_stock_management?: boolean;

  @IsNotEmpty()
  @IsString()
  date_add!: string;

  @IsNotEmpty()
  @IsString()
  date_upd!: string;

  @IsOptional()
  @IsString()
  pack_stock_type?: string;

  @IsOptional()
  @IsString()
  meta_description?: string;

  @IsOptional()
  @IsString()
  meta_keywords?: string;

  @IsOptional()
  @IsString()
  meta_title?: string;

  @IsOptional()
  @IsString()
  link_rewrite?: string;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  description_short?: string;

  @IsOptional()
  @IsString()
  available_now?: string;

  @IsOptional()
  @IsString()
  available_later?: string;

  @IsOptional()
  @IsArray()
  associations?: Association;
}

export class OrderDTO {
  @IsNumber()
  id!: number;

  @IsString()
  shipping_number!: string;
}

class Association {
  @IsOptional()
  @IsArray()
  accessories?: Array<Accessories>;

  @IsOptional()
  @IsArray()
  product_pack?: Array<ProductPack>;

  @IsNotEmpty()
  @IsArray()
  @IsOptional()
  categories?: Array<Categories>;

  @IsOptional()
  @IsArray()
  images?: Array<Images>;

  @IsOptional()
  @IsArray()
  combinations?: Array<Combinations>;

  @IsOptional()
  @IsArray()
  product_option_values?: Array<ProductOptionValues>;

  @IsOptional()
  @IsArray()
  tags?: Array<Tags>;

  @IsOptional()
  @IsArray()
  stock_availables?: Array<StockAvailables>;

  @IsOptional()
  @IsArray()
  product_features?: Array<ProductFeature>;
}

export class ProductFeature {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  id_feature_value?: string;
}

class Accessories {
  @IsOptional()
  @IsString()
  id?: string;
}

class ProductPack {
  @IsOptional()
  @IsString()
  id?: string;
}

export class Categories {
  @IsNotEmpty()
  @IsNumberString()
  id!: string;
}

class Images {
  @IsNotEmpty()
  id!: string;
}

export class Combinations {
  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  id_product_attribute?: string;
}

class ProductOptionValues {
  @IsOptional()
  @IsString()
  id?: string;
}

class Tags {
  @IsOptional()
  @IsString()
  id?: string;
}

export class StockAvailables {
  @IsNotEmpty()
  @IsString()
  id!: string;

  @IsNotEmpty()
  @IsString()
  id_product_attribute!: string;
}
