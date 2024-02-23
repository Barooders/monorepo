import { base64_encode } from '@libs/helpers/base64';
import { UnreachableExternalApiException } from '@modules/pro-vendor/domain/exception/unreachable-external-api.exception';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import fetch from 'node-fetch';
import { TuvalumProductDto } from './dto/tuvalum-product.input.dto';

@Injectable()
export class TuvalumClient {
  private readonly logger = new Logger(TuvalumClient.name);

  constructor(private readonly vendorConfigService: IVendorConfigService) {}

  private getFetchOptions = () => {
    return {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization:
          'Basic ' +
          base64_encode(
            this.vendorConfigService.getVendorConfig().username +
              ':' +
              this.vendorConfigService.getVendorConfig().password,
          ),
        'x-api-key':
          this.vendorConfigService.getVendorConfig().apiKey ?? 'NO_API_KEY',
      },
    };
  };

  async getAllProducts(): Promise<TuvalumProductDto[] | null> {
    try {
      const response = await fetch(
        this.vendorConfigService.getVendorConfig().apiUrl +
          `/api/integration/products`,
        this.getFetchOptions(),
      );

      return (await response.json()) as TuvalumProductDto[];
    } catch (error) {
      this.logger.error('error getAllProductsFromTuvalum', error);
      return null;
    }
  }

  async getProduct(product_id: string): Promise<TuvalumProductDto | null> {
    const res = await fetch(
      this.vendorConfigService.getVendorConfig().apiUrl +
        `/api/integration/products/${product_id}`,
      this.getFetchOptions(),
    ).then((res: { json: () => any }) => res.json());

    if (res.status === 404) {
      return null;
    }

    if (res.status >= 400) {
      throw new UnreachableExternalApiException(
        this.vendorConfigService.getVendorConfig().slug,
        'Could not reach API due to an error',
      );
    }

    return res;
  }

  async isUp(): Promise<boolean> {
    const response = await fetch(
      this.vendorConfigService.getVendorConfig().apiUrl + `/api/healthcheck`,
      this.getFetchOptions(),
    );

    const status = await response.status;

    if (status === 200) return true;

    throw new Error('Tuvalum is down');
  }
}
