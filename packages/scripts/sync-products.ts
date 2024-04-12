import Medusa from '@medusajs/medusa-js';
import { ProductStatus as MedusaStatus } from '@medusajs/types';
import { PrismaClient, ProductStatus } from '__generated/store-client';
import 'dotenv.config';
import { compact, first } from 'lodash';

const prisma = new PrismaClient();

const MEDUSA_BACKEND_URL = 'https://store.barooders.com';
const medusa = new Medusa({
  baseUrl: MEDUSA_BACKEND_URL,
  maxRetries: 3,
  apiKey: process.env.MEDUSA_DEVELOPER_API_TOKEN,
});

const mapStatus = (status: ProductStatus): MedusaStatus => {
  return status === 'ACTIVE'
    ? MedusaStatus.PUBLISHED
    : status === 'ARCHIVED'
      ? MedusaStatus.REJECTED
      : MedusaStatus.DRAFT;
};

const createCategory = async (categoryName: string) => {
  console.log(`Creating category ${categoryName}`);
  const createResponse = await medusa.admin.productCategories.create({
    name: categoryName,
    is_active: true,
  });

  return createResponse.product_category.id;
};

const getOrCreateCategory = async (categoryName: string) => {
  try {
    const response = await medusa.admin.productCategories.list({
      q: categoryName,
    });
    const existingCategory = first(response.product_categories);
    if (existingCategory) return existingCategory.id;

    return createCategory(categoryName);
  } catch (e) {
    return createCategory(categoryName);
  }
};

const syncProducts = async (onlyActive: boolean) => {
  const statusWhereClause = onlyActive
    ? { status: { equals: ProductStatus.ACTIVE } }
    : {};
  const productIds = await prisma.storeExposedProduct.findMany({
    select: { id: true, handle: true },
    where: statusWhereClause,
  });

  console.log(`Syncing ${productIds.length} products in Medusa`);

  for (const { id, handle } of productIds) {
    try {
      const existingProduct = await medusa.admin.products.list({ handle });
      if (existingProduct.count > 0) continue;
    } catch (e) {}

    console.log(`Treating product ${id} `);
    const product = await prisma.storeExposedProduct.findFirstOrThrow({
      where: { id },
      include: {
        product: {
          include: {
            exposedImages: true,
            storeProductForAnalytics: true,
            collections: true,
            baseProductVariants: {
              include: {
                exposedProductVariant: true,
              },
            },
          },
        },
      },
    });
    const firstVariant = first(
      product.product.baseProductVariants,
    )?.exposedProductVariant;

    if (!firstVariant) {
      console.error(`No variant found on product ${product.id}`);
      continue;
    }

    const productTypeId = await getOrCreateCategory(product.productType);

    await medusa.admin.products.create({
      title: product.title,
      is_giftcard: false,
      discountable: true,
      status: mapStatus(product.status),
      thumbnail: product.firstImage ?? undefined,
      images: product.product.exposedImages.map((image) => image.src),
      handle: product.handle,
      description: product.description ?? undefined,
      options: compact([
        firstVariant.option1Name,
        firstVariant.option2Name,
        firstVariant.option3Name,
      ]).map((name) => ({ title: name })),
      categories: [{ id: productTypeId }],
      variants: compact(
        product.product.baseProductVariants.map((variant) => {
          if (!variant.exposedProductVariant) return;
          return {
            prices: [
              {
                amount: Math.round(
                  Number(variant.exposedProductVariant.price) * 100,
                ),
                currency_code: 'EUR',
              },
            ],
            title: variant.exposedProductVariant.title,
            options: compact([
              firstVariant.option1,
              firstVariant.option2,
              firstVariant.option3,
            ]).map((option) => ({ value: option })),
            ean: product.product.storeProductForAnalytics?.EANCode ?? undefined,
            inventory_quantity: Number(
              variant.exposedProductVariant.inventoryQuantity,
            ),
          };
        }),
      ),
    });
  }
};

syncProducts(true);
