import { jsonStringify } from '@libs/helpers/json';
import { OrderVendorInput } from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { get } from 'lodash';
import fetch from 'node-fetch';
import { create } from 'xmlbuilder2';
import { CarrierDTO } from './dto/prestashop-carrier.dto';
import { CategoryDTO } from './dto/prestashop-category.dto';
import { CombinaisonDTO } from './dto/prestashop-combinaison.dto';
import { ProductFeatureValueDTO } from './dto/prestashop-product-feature-value.dto';
import { ProductFeatureDTO } from './dto/prestashop-product-features.dto';
import { ProductOptionValuesDTO } from './dto/prestashop-product-option-values.dto';
import { ProductOptionDTO } from './dto/prestashop-product-options.dto';
import { OrderDTO, ProductDTO } from './dto/prestashop-product.dto';
import { StockAvailableDTO } from './dto/prestashop-stock-available.dto';

const PRODUCTS_PER_PAGE = 1000;
const MAX_OFFSET = 1000 * PRODUCTS_PER_PAGE;

const FETCH_OPTIONS = {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'accept-encoding': 'gzip;q=0,deflate,sdch',
  },
};
@Injectable()
export class PrestashopClient {
  private readonly logger = new Logger(PrestashopClient.name);

  constructor(private readonly vendorConfigService: IVendorConfigService) {}

  async getProductImage(id: string): Promise<string | null> {
    try {
      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `images/products/${id}?ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      ).then((res: { arrayBuffer: () => any }) => res.arrayBuffer());

      return Buffer.from(res, 'binary').toString('base64');
    } catch (error) {
      this.logger.error('error getProductImage : ', error);

      return null;
    }
  }

  async getProductOptions(id: string): Promise<ProductOptionDTO | null> {
    try {
      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `product_options/${id}?output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());
      if (res.product_option) {
        return res.product_option;
      }
      throw new Error('Missing product_option field in response');
    } catch (error) {
      this.logger.error('error getProductOptions : ', error);

      return null;
    }
  }

  async getProductOptionValues(
    id: string,
  ): Promise<ProductOptionValuesDTO | null> {
    try {
      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `product_option_values/${id}?output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());

      if (res.product_option_value) {
        return res.product_option_value;
      } else {
        return null;
      }
    } catch (error) {
      this.logger.error('error getProductOptionValues : ', error);

      return null;
    }
  }

  async getProductFeatures(id: string): Promise<ProductFeatureDTO | null> {
    try {
      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `product_features/${id}?output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());

      if (res.product_feature) {
        return res.product_feature;
      }
      throw new Error('Missing product_feature field in response');
    } catch (error) {
      this.logger.error('error getProductFeatures : ', error);

      return null;
    }
  }

  async getProductFeatureValues(
    id: string,
  ): Promise<ProductFeatureValueDTO | null> {
    try {
      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `product_feature_values/${id}?output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());

      if (res.product_feature_value) {
        return res.product_feature_value;
      }
      throw new Error('Missing product_feature_value field in response');
    } catch (error) {
      this.logger.error('error getProductFeatureValues : ', error);

      return null;
    }
  }

  async getProduct(id: string): Promise<ProductDTO | null> {
    try {
      if (!id) throw new Error('id is required');

      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `products/${id}?&price[price_on_sale][use_tax]=1&price[price_on_sale][use_reduction]=1&price[price_old][use_tax]=1&price[price_old][use_reduction]=0&output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());

      if (res.product) {
        return res.product;
      }
      throw new Error('Missing product field in response');
    } catch (error) {
      this.logger.error('error getProduct : ', error);

      return null;
    }
  }

  async getStockItem(id: string): Promise<StockAvailableDTO | null> {
    try {
      if (!id) throw new Error('id is required');

      const response = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `stock_availables/${id}?output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      );

      if (!response.ok && response.status === 404) {
        this.logger.debug(`Variant ${id} not found in stock_availables`);
        return null;
      }

      if (!response.ok) {
        this.logger.warn(
          `Encountered error with code ${response.status} on Variant ${id}`,
        );
      }

      const res = await response.json();
      if (res.stock_available) {
        return res.stock_available;
      }

      throw new Error('Missing stock_available field in response');
    } catch (error) {
      this.logger.error('error getStockItem : ', error);

      return null;
    }
  }

  async getCombination(id: string): Promise<CombinaisonDTO | null> {
    try {
      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `combinations/${id}?output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }&price[price_on_sale][use_tax]=1&price[price_on_sale][use_reduction]=1&price[price_old][use_tax]=1&price[price_old][use_reduction]=0`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());

      if (res.combination) {
        return res.combination;
      }
      throw new Error('Missing combination field in response');
    } catch (error) {
      this.logger.error('error getCombination : ', error);

      return null;
    }
  }

  async getCarriers(name: string): Promise<CarrierDTO[] | null> {
    try {
      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `carriers?output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }&display=full&limit=1&filter[active]=1&filter[deleted]=0&filter[name]=${name}`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());

      if (res.carriers) {
        return res.carriers;
      }
      throw new Error('Missing carriers field in response');
    } catch (error) {
      this.logger.error('error getCarriers : ', error);

      return null;
    }
  }

  async getCategory(id: string): Promise<CategoryDTO | null> {
    try {
      const res = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `categories/${id}?output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());
      if (res.category) {
        return res.category;
      }
      throw new Error('Missing category field in response');
    } catch (error) {
      this.logger.error('error getCategory : ', error);

      return null;
    }
  }

  async getAllProducts(): Promise<ProductDTO[]> {
    let pageProducts = await this.getPageProducts(0, PRODUCTS_PER_PAGE);
    const products: ProductDTO[] = [...pageProducts];
    let offset = PRODUCTS_PER_PAGE;

    while (pageProducts.length > 0 && offset < MAX_OFFSET) {
      try {
        this.logger.debug(`Loading from n°${offset}`);
        pageProducts = await this.getPageProducts(offset, PRODUCTS_PER_PAGE);
        products.push(...pageProducts);
      } catch (e) {
        this.logger.error(`Failed to load chunk because: `, e);
        pageProducts = [];
      }

      offset += PRODUCTS_PER_PAGE;
    }
    return products;
  }

  async getPageProducts(
    offset: number,
    itemsPerPage: number,
  ): Promise<ProductDTO[]> {
    const { catalog } = this.vendorConfigService.getVendorConfig();
    if (!('prestashop' in catalog)) {
      throw new Error('Config is not a Prestashop config');
    }
    const categoriesToFilterInFetch =
      catalog.prestashop?.categoriesToFilterInFetch;
    const queryParams = {
      output_format: 'JSON',
      ws_key: this.vendorConfigService.getVendorConfig().apiKey ?? 'NO_API_KEY',
      'price[price_on_sale][use_tax]': '1',
      'price[price_old][use_tax]': '1',
      'price[price_on_sale][use_reduction]': '1',
      'price[price_old][use_reduction]': '0',
      'filter[active]': '1',
      ...(categoriesToFilterInFetch &&
        categoriesToFilterInFetch.length > 0 && {
          'filter[id_category_default]': `[${categoriesToFilterInFetch.join(
            '|',
          )}]`,
        }),
      display: 'full',
      limit: `${offset},${itemsPerPage}`,
    };

    const endpoint = new URL(
      this.vendorConfigService.getVendorConfig().apiUrl + 'products',
    );

    endpoint.search = new URLSearchParams(queryParams).toString();
    const res = await fetch(endpoint.href, FETCH_OPTIONS).then(
      (res: { json: () => any }) => res.json(),
    );
    if (res.products) {
      return res.products;
    }
    if (Array.isArray(res)) {
      return [];
    }
    throw new Error(
      `Missing products array in response: ${jsonStringify(res)}`,
    );
  }

  async getOrder(id: string): Promise<OrderDTO | null> {
    try {
      const response = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `orders/${id}?limit=1&output_format=JSON&ws_key=${
            this.vendorConfigService.getVendorConfig().apiKey
          }`,
        FETCH_OPTIONS,
      ).then((res: { json: () => any }) => res.json());

      const order = get(response, 'order');

      if (!order) {
        throw new Error('Missing order field in response');
      }
      return order;
    } catch (error) {
      this.logger.error('Error getting Prestashop order: ', error);

      return null;
    }
  }

  async createCustomer({
    password,
    firstName,
    lastName,
    obfuscatedEmail,
  }: OrderVendorInput['customer']): Promise<string> {
    const suffix =
      this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.firstNameSuffix ?? '';
    const customerGroupId =
      this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.customerGroupId;

    const xmlBody = create(
      { version: '1.0' },
      {
        prestashop: {
          customer: {
            passwd: password,
            lastname: lastName,
            firstname: `${firstName}${suffix}`,
            email: obfuscatedEmail,
            active: '1',
            newsletter: '0',
            optin: '0',
            id_default_group:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.customerDefaultGroupId ?? '0',
            ...(customerGroupId
              ? {
                  associations: {
                    groups: {
                      group: {
                        id: customerGroupId,
                      },
                    },
                  },
                }
              : {}),
          },
        },
      },
    );

    return await this.postXMLResource(
      'customers',
      'customer',
      xmlBody.end({ prettyPrint: true }),
    );
  }

  async createAddress(
    customerId: string,
    {
      firstName,
      lastName,
      company,
      address1,
      address2,
      phone,
      zipCode,
      city,
    }: OrderVendorInput['customer'],
  ): Promise<string> {
    const xmlBody = create(
      { version: '1.0' },
      {
        prestashop: {
          address: {
            id_country:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.countryId ?? '0',
            alias: firstName,
            company,
            lastname: lastName,
            firstname: firstName,
            address1,
            address2,
            phone,
            postcode: zipCode,
            city,
            id_customer: customerId,
          },
        },
      },
    );

    return await this.postXMLResource(
      'addresses',
      'address',
      xmlBody.end({ prettyPrint: true }),
    );
  }

  async createCart(
    customerId: string,
    carrierId: string,
    addressId: string,
    {
      externalProductId,
      externalVariantId,
      quantity,
    }: OrderVendorInput['products'][0],
  ): Promise<string> {
    const xmlBody = create(
      { version: '1.0' },
      {
        prestashop: {
          cart: {
            id_currency:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.currencyId ?? '1',
            id_lang:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.langId ?? '1',
            id_customer: customerId,
            id_address_delivery: addressId,
            id_address_invoice: addressId,
            id_shop_group:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.shopGroupId ?? '1',
            id_shop:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.shopId ?? '1',
            id_carrier: carrierId,
            delivery_option: `{"${addressId}":"${carrierId},"}`,
            associations: {
              cart_rows: {
                cart_row: {
                  id_product: externalProductId,
                  id_product_attribute: externalVariantId,
                  id_address_delivery: addressId,
                  quantity,
                },
              },
            },
          },
        },
      },
    );

    const xmlBodyString = xmlBody.end({ prettyPrint: true });
    this.logger.warn(`Creating cart with body: ${xmlBodyString}`);

    return await this.postXMLResource('carts', 'cart', xmlBodyString);
  }

  async createOrder(
    externalProductId: string,
    addressId: string,
    cartId: string,
    customerId: string,
    carrierId: string,
    productsTotalPrice: number,
    productsTotalPriceWithoutTaxes: number,
    productType: string,
  ): Promise<string> {
    const totalPaid = await this.getTotalPaid({
      externalProductId,
      productsTotalPrice,
      productType,
    });

    const orderStateId =
      this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.orderStateId ?? '1';

    const xmlBody = create(
      { version: '1.0' },
      {
        prestashop: {
          order: {
            id_address_delivery: addressId,
            id_address_invoice: addressId,
            id_cart: cartId,
            id_currency:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.currencyId ?? '1',
            id_lang:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.langId ?? '1',
            id_customer: customerId,
            id_carrier: carrierId,
            module:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.paymentModule ?? 'module',
            payment:
              this.vendorConfigService.getVendorConfig().order?.prestashop
                ?.paymentMethodName ?? 'payment',
            total_paid: totalPaid.toFixed(5),
            total_paid_real: totalPaid.toFixed(5),
            total_products: productsTotalPriceWithoutTaxes.toFixed(5),
            total_products_wt: productsTotalPrice.toFixed(5),
            conversion_rate: '1',
            current_state: orderStateId,
          },
        },
      },
    );

    const xmlBodyString = xmlBody.end({ prettyPrint: true });
    this.logger.warn(`Creating order with body: ${xmlBodyString}`);

    const orderId = await this.postXMLResource(
      'orders',
      'order',
      xmlBodyString,
    );

    if (
      this.vendorConfigService.getVendorConfig()?.order?.prestashop
        ?.forceOrderStatusAfterCreation
    ) {
      const updateXmlBody = create(
        { version: '1.0' },
        {
          prestashop: {
            order_history: {
              id_order_state: orderStateId,
              id_order: orderId,
            },
          },
        },
      );

      const updateXmlBodyString = updateXmlBody.end({ prettyPrint: true });
      this.logger.warn(`Updating order with body: ${updateXmlBodyString}`);

      await this.postXMLResource(
        'order_histories',
        'order_history',
        updateXmlBodyString,
      );
    }

    return orderId;
  }

  private async postXMLResource(
    path: string,
    resourceName: string,
    body: string,
  ): Promise<string> {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/xml',
      },
      body,
    };

    const endpoint = new URL(
      this.vendorConfigService.getVendorConfig().apiUrl + path,
    );

    endpoint.search = new URLSearchParams({
      output_format: 'JSON',
      ws_key: this.vendorConfigService.getVendorConfig().apiKey ?? 'NO_API_KEY',
    }).toString();

    const response = await fetch(endpoint.href, options);

    if (!response.ok) {
      throw new Error(
        `Failed to create new ${resourceName}: [${
          response.statusText
        }]${jsonStringify(await response.json())}. Body was: ${body}`,
      );
    }

    const data = await response.json();
    const createdId = get(data, `${resourceName}.id`);

    if (response.status !== 201 || !createdId) {
      throw new Error(
        `Failed to create new ${resourceName}: ${jsonStringify(
          data,
        )}. Body was: ${body}`,
      );
    }

    return String(createdId);
  }

  private async getTotalPaid({
    externalProductId,
    productsTotalPrice,
    productType,
  }: {
    externalProductId: string;
    productsTotalPrice: number;
    productType: string;
  }): Promise<number> {
    const getShippingCost =
      this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.getShippingCost;

    if (!getShippingCost) {
      throw new Error(`getShippingCost is not set`);
    }

    if (
      !this.vendorConfigService.getVendorConfig().order?.prestashop
        ?.fetchProductWeightForShippingCompute
    ) {
      return (
        productsTotalPrice +
        getShippingCost({
          productsTotalPrice,
          productType,
        })
      );
    }

    const product = await this.getProduct(externalProductId);

    if (!product) {
      throw new Error(`Product ${externalProductId} not found`);
    }

    return (
      productsTotalPrice +
      getShippingCost({
        weight: product.weight ? Number(product.weight) : 0,
        productsTotalPrice: productsTotalPrice,
        productType,
      })
    );
  }
}
