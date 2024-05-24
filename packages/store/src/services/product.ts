import {
  Logger,
  ProductService as MedusaProductService,
  Product,
} from '@medusajs/medusa';
import { CreateProductInput } from '@medusajs/medusa/dist/types/product';
import MultiFormatImageService from './multi-format-image';

type InjectedDependencies = ConstructorParameters<
  typeof MedusaProductService
>[0] & {
  logger: Logger;
  multiFormatImageService: MultiFormatImageService;
};

class ProductService extends MedusaProductService {
  protected readonly logger_: Logger;
  protected readonly multiFormatImageService_: MultiFormatImageService;

  constructor(container) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    this.logger_ = container.logger;
    this.multiFormatImageService_ = container.multiFormatImageService;
  }

  async create(productObject: CreateProductInput): Promise<Product> {
    this.logger_.info('Creating product');

    const uploadedImages = await Promise.all(
      productObject.images.map(
        async (imageUrl) =>
          await this.multiFormatImageService_.multiFormatUploadFromUrl({
            url: imageUrl,
            fileName: imageUrl.split('/').pop(),
          }),
      ),
    );
    const flattenImages = uploadedImages.flatMap((url) => url);

    this.logger_.info(`Images uploaded: ${uploadedImages.join(', ')}`);

    return await super.create({
      ...productObject,
      images: flattenImages.filter((url) => url.includes('large')),
      thumbnail: flattenImages.find((url) => url.includes('small')),
    });
  }
}

export default ProductService;
