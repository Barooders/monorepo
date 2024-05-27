import {
  Logger,
  ProductService as MedusaProductService,
  Product,
} from '@medusajs/medusa';
import { CreateProductInput } from '@medusajs/medusa/dist/types/product';
import { v4 as uuidv4 } from 'uuid';
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

  constructor(container: InjectedDependencies) {
    // eslint-disable-next-line prefer-rest-params
    super(arguments[0]);

    try {
      this.logger_ = container.logger;
      this.multiFormatImageService_ = container.multiFormatImageService;
    } catch (e) {
      // avoid errors when the backend first loads
    }
  }

  async create(productObject: CreateProductInput): Promise<Product> {
    this.logger_.info('Creating product');

    const mappedImages = (productObject.images ?? []).map((imageUrl) => ({
      url: imageUrl,
      fileName: uuidv4(),
    }));

    mappedImages.forEach((image) =>
      this.multiFormatImageService_.multiFormatUploadFromUrl(image),
    );

    return await super.create({
      ...productObject,
      images: mappedImages.map((image) => `${image.fileName}.png`),
      thumbnail: mappedImages[0]?.fileName + '-thumbnail.png',
    });
  }
}

export default ProductService;
