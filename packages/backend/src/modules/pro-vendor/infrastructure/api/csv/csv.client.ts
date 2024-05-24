import { SalesChannelName } from '@libs/domain/prisma.main.client';
import { Amount, Stock, URL } from '@libs/domain/value-objects';
import { extractRowsFromCSVRawText } from '@libs/helpers/csv';
import { jsonStringify } from '@libs/helpers/json';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { Cache } from 'cache-manager';
import { compact, head, nth } from 'lodash';
import { CSVProduct } from './types';

type Option = {
  key: string | undefined;
  value: string | undefined;
};

type VariantOptions = {
  option1?: Option;
  option2?: Option;
  option3?: Option;
};

const mapValidKeyValuePair = ({
  key,
  value,
}: Option): { key: string; value: string } | undefined => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return key && value ? { key, value } : undefined;
};

const getColumnValue = (
  array: string[],
  columnNumber: number | undefined,
): string | undefined => {
  // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
  return columnNumber ? nth(array, columnNumber - 1) : undefined;
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

export const RAW_CSV_CACHE_TTL_IN_MILLISECONDS = 2 * 60 * 1000;

@Injectable()
export class CSVClient {
  private readonly logger = new Logger(CSVClient.name);

  constructor(
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async getAllProducts(productId?: string): Promise<CSVProduct[]> {
    const rawCSV = await this.getRawCSV();

    return await this.mapCsvRowsToProducts(rawCSV, productId);
  }

  async getProductById(id: string): Promise<CSVProduct | null> {
    const allProducts = await this.getAllProducts(id);

    return head(allProducts) ?? null;
  }

  async getProductVariant(
    productId: string,
    variantId: string,
  ): Promise<CSVProduct['variants'][number] | null> {
    const product = await this.getProductById(productId);

    return (
      product?.variants.find((variant) => variant.id === variantId) ?? null
    );
  }

  private async getRawCSV(): Promise<string> {
    const cacheKey = `raw_csv_${this.vendorConfigService.getVendorConfig().apiUrl}`;

    const cachedRawCSV = await this.cacheManager.get<string>(cacheKey);

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (cachedRawCSV) {
      return cachedRawCSV;
    }

    const csvUrl = this.vendorConfigService.getVendorConfig().apiUrl;
    const response = await fetch(csvUrl);

    if (!response.ok) {
      throw new Error(`Cannot fetch CSV: ${csvUrl}`);
    }

    const rawCsv = await response.text();

    await this.cacheManager.set(
      cacheKey,
      rawCsv,
      RAW_CSV_CACHE_TTL_IN_MILLISECONDS,
    );

    return rawCsv;
  }

  private async mapCsvRowsToProducts(
    text: string,
    productId?: string,
  ): Promise<CSVProduct[]> {
    const csvColumnsConfig =
      this.vendorConfigService.getVendorConfig().catalog.csv?.columns;

    if (!csvColumnsConfig) {
      throw new Error('CSV columns config not found');
    }

    const textTransformer =
      this.vendorConfigService.getVendorConfig().catalog.csv?.textTransformer;
    const textToParse = textTransformer ? textTransformer(text) : text;

    const extractedRows = await extractRowsFromCSVRawText(textToParse, {
      from: 2,
    });

    const rows = extractedRows.filter((row) => {
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      if (!productId) return true;

      return getColumnValue(row, csvColumnsConfig.productId) === productId;
    });

    const headers = (
      await extractRowsFromCSVRawText(textToParse, { from: 1, to: 1 })
    )[0];

    if (rows.some((row) => row.length !== headers.length)) {
      throw new Error('Some CSV rows have different length from header');
    }

    const getVariantKey = ({
      option1,
      option2,
      option3,
    }: VariantOptions): string => {
      return [
        option1?.value?.trim(),
        option2?.value?.trim(),
        option3?.value?.trim(),
      ]
        .filter(Boolean)
        .join(' - ');
    };

    const variants = rows.map((row) => ({
      productId: getColumnValue(row, csvColumnsConfig.productId),
      productType: csvColumnsConfig.productType
        .map((productTypeColumn) => getColumnValue(row, productTypeColumn))
        .join(' - '),
      variantId: getColumnValue(row, csvColumnsConfig.variantId),
      variantCondition: getColumnValue(row, csvColumnsConfig.variantCondition),
      productTitle: getColumnValue(row, csvColumnsConfig.productTitle),
      description:
        csvColumnsConfig.description
          ?.map((description) => getColumnValue(row, description))
          .join('<br>') ?? '',
      tags: csvColumnsConfig.tags.map((tag) => ({
        key: getColumnValue(headers, tag),
        value: getColumnValue(row, tag),
      })),
      images: csvColumnsConfig.images.map((image) =>
        getColumnValue(row, image),
      ),
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      inventoryQuantity: csvColumnsConfig.inventoryQuantity
        ? getColumnValue(row, csvColumnsConfig.inventoryQuantity)
        : '1',
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      isActive: getColumnValue(row, csvColumnsConfig.isActive)
        ? getColumnValue(row, csvColumnsConfig.isActive) === '1'
        : true,
      price: getColumnValue(row, csvColumnsConfig.price),
      compareAtPrice: getColumnValue(row, csvColumnsConfig.compareAtPrice),
      option1: {
        key: getColumnValue(headers, csvColumnsConfig.option1),
        value: getColumnValue(row, csvColumnsConfig.option1),
      },
      option2: {
        key: getColumnValue(headers, csvColumnsConfig.option2),
        value: getColumnValue(row, csvColumnsConfig.option2),
      },
      option3: {
        key: getColumnValue(headers, csvColumnsConfig.option3),
        value: getColumnValue(row, csvColumnsConfig.option3),
      },
      productEANCode: getColumnValue(row, csvColumnsConfig.productEANCode),
    }));

    const salesChannelsConfig =
      this.vendorConfigService.getVendorConfig().catalog.csv?.salesChannels;
    const salesChannels =
      salesChannelsConfig !== undefined
        ? salesChannelsConfig
        : [SalesChannelName.PUBLIC];

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

      if (!existingProduct) {
        acc.push({
          id: variant.productId,
          type: variant.productType,
          title: variant.productTitle,
          description: variant.description,
          images: variant.images
            // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
            .flatMap((image) => (image ? [image] : []))
            .map((image) => new URL({ url: image })),
          variants: [mappedVariant],
          tags: compact(variant.tags.map(mapValidKeyValuePair)),
          EANCode: variant.productEANCode,
          salesChannels,
        });
        return acc;
      }

      if (existingProduct.variants.some((v) => v.id === variant.variantId)) {
        this.logger.debug(
          `Variant with ID ${variant.variantId} already exists for product ID ${variant.productId}`,
        );
        return acc;
      }

      if (
        existingProduct.variants.some(
          (v) => getVariantKey(v) === getVariantKey(variant),
        )
      ) {
        this.logger.debug(
          `Variant with ID ${
            variant.variantId
          } already exists with same options ${getVariantKey(variant)}`,
        );
        return acc;
      }

      existingProduct.variants.push(mappedVariant);
      return acc;
    }, [] as CSVProduct[]);
  }
}
