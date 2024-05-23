import { Amount, Stock, URL } from '@libs/domain/value-objects';
import { jsonStringify } from '@libs/helpers/json';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { load } from 'cheerio';
import { compact, head } from 'lodash';
import { XMLProduct } from './types';

const mapValidKeyValuePair = ({
  key,
  value,
}: {
  key: string | undefined;
  value: string | undefined;
}): { key: string; value: string } | undefined => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return key && value ? { key, value } : undefined;
};

const parseAmountString = (amount: string): number => {
  return parseFloat(
    amount
      .replaceAll('€', '')
      .replaceAll(' ', '')
      .replaceAll(' ', '')
      .replaceAll(',', '.')
      .replaceAll('EUR', ''),
  );
};
@Injectable()
export class XMLClient {
  private readonly logger = new Logger(XMLClient.name);

  constructor(private readonly vendorConfigService: IVendorConfigService) {}

  async getAllProducts(productId?: string): Promise<XMLProduct[]> {
    const xmlUrl = this.vendorConfigService.getVendorConfig().apiUrl;
    const response = await fetch(xmlUrl);

    if (!response.ok) {
      throw new Error(`Cannot fetch XML: ${xmlUrl}`);
    }

    const rawXml = await response.text();

    return await this.mapXmlRowsToProducts(rawXml, productId);
  }

  async getProductById(id: string): Promise<XMLProduct | null> {
    const allProducts = await this.getAllProducts(id);

    return head(allProducts) ?? null;
  }

  async getProductVariant(
    productId: string,
    variantId: string,
  ): Promise<XMLProduct['variants'][number] | null> {
    const product = await this.getProductById(productId);

    return (
      product?.variants.find((variant) => variant.id === variantId) ?? null
    );
  }

  private async mapXmlRowsToProducts(
    text: string,
    productId?: string,
  ): Promise<XMLProduct[]> {
    const $ = load(text, { xmlMode: true });

    const xmlFieldsConfig =
      this.vendorConfigService.getVendorConfig().catalog.xml?.fields;

    if (!xmlFieldsConfig) {
      throw new Error('XML fields config not found');
    }

    const variants = [...$(xmlFieldsConfig.variant)]
      .map((item) => $(item))
      .filter((xmlProduct) => {
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        if (!productId) return true;

        return (
          xmlProduct.find(xmlFieldsConfig.productId).first().text() ===
          productId
        );
      })
      .map((xmlProduct) => {
        return {
          variantId: xmlProduct.find(xmlFieldsConfig.variantId).first().text(),
          productId: xmlProduct.find(xmlFieldsConfig.productId).first().text(),
          productType: xmlProduct
            .find(xmlFieldsConfig.productType)
            .first()
            .text(),
          variantCondition: xmlProduct
            .find(xmlFieldsConfig.variantCondition)
            .first()
            .text(),
          productTitle: xmlProduct
            .find(xmlFieldsConfig.productTitle)
            .first()
            .text(),
          description: xmlProduct
            .find(xmlFieldsConfig.description)
            .first()
            .text(),
          tags: xmlFieldsConfig.tags.map((tag) => ({
            key: tag,
            value: xmlProduct.find(tag).first().text(),
          })),
          images: xmlFieldsConfig.images.map((image) =>
            xmlProduct.find(image).first().text(),
          ),
          inventoryQuantity: xmlProduct
            .find(xmlFieldsConfig.inventoryQuantity)
            .first()
            .text(),
          isActive: true,
          price: xmlProduct.find(xmlFieldsConfig.price).first().text(),
          compareAtPrice: xmlProduct
            .find(xmlFieldsConfig.compareAtPrice)
            .first()
            .text(),
          option1: {
            key: xmlFieldsConfig.option1?.key,
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            value: xmlFieldsConfig.option1?.value
              ? xmlProduct.find(xmlFieldsConfig.option1.value).first().text()
              : undefined,
          },
          option2: {
            key: xmlFieldsConfig.option2?.key,
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            value: xmlFieldsConfig.option2?.value
              ? xmlProduct.find(xmlFieldsConfig.option2.value).first().text()
              : undefined,
          },
          option3: {
            key: xmlFieldsConfig.option3?.key,
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            value: xmlFieldsConfig.option3?.value
              ? xmlProduct.find(xmlFieldsConfig.option3.value).first().text()
              : undefined,
          },
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          productEANCode: xmlFieldsConfig.productEANCode
            ? xmlProduct.find(xmlFieldsConfig.productEANCode).first().text()
            : undefined,
        };
      });

    return variants.reduce((acc, variant) => {
      const existingProduct = acc.find(
        (product) => product.id === variant.productId,
      );

      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!variant.variantId) {
        this.logger.warn(
          `Variant ID not found for product ID: ${variant.productId}`,
        );
        return acc;
      }

      if (!variant.isActive) {
        this.logger.debug(
          `Variant with ID ${variant.productId} is not active: ${jsonStringify(
            variant,
          )}`,
        );
        return acc;
      }

      if (
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        !variant.productId ||
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        !variant.variantCondition ||
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        !variant.productTitle ||
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        !variant.productType ||
        variant.images.filter(Boolean).length === 0 ||
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        !variant.price ||
        isNaN(parseFloat(variant.price)) ||
        // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
        !variant.inventoryQuantity ||
        isNaN(parseInt(variant.inventoryQuantity))
      ) {
        this.logger.warn(
          `Variant with ID ${
            variant.variantId
          } has invalid data: ${jsonStringify(variant)}`,
        );
        return acc;
      }

      const mappedVariant = {
        id: variant.variantId,
        condition: variant.variantCondition,
        price: new Amount({
          amountInCents: Math.floor(parseAmountString(variant.price) * 100),
        }),
        compareAtPrice:
          // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
          variant.compareAtPrice && !isNaN(parseFloat(variant.compareAtPrice))
            ? new Amount({
                amountInCents: Math.floor(
                  Math.floor(parseAmountString(variant.compareAtPrice) * 100),
                ),
              })
            : undefined,
        inventoryQuantity: new Stock({
          stock: parseInt(variant.inventoryQuantity),
        }),
        option1: mapValidKeyValuePair(variant.option1),
        option2: mapValidKeyValuePair(variant.option2),
        option3: mapValidKeyValuePair(variant.option3),
      };

      if (existingProduct) {
        existingProduct.variants.push(mappedVariant);
      } else {
        acc.push({
          id: variant.productId,
          type: variant.productType,
          title: variant.productTitle,
          description: variant.description ?? '',
          images: variant.images
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            .flatMap((image) => (image ? [image] : []))
            .map((image) => new URL({ url: image })),
          variants: [mappedVariant],
          tags: compact(variant.tags.map(mapValidKeyValuePair)),
          EANCode: variant.productEANCode,
        });
      }

      return acc;
    }, [] as XMLProduct[]);
  }
}
