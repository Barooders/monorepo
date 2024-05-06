import { base64_encode } from '@libs/helpers/base64';
import { createHttpClient } from '@libs/infrastructure/http/clients';
import { UnreachableExternalApiException } from '@modules/pro-vendor/domain/exception/unreachable-external-api.exception';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { TuvalumProductDto } from './dto/tuvalum-product.input.dto';

@Injectable()
export class TuvalumClient {
  private readonly logger = new Logger(TuvalumClient.name);

  constructor(private readonly vendorConfigService: IVendorConfigService) {}

  async getAllProducts(): Promise<TuvalumProductDto[] | null> {
    try {
      const client = this.getClient();
      return await client<TuvalumProductDto[]>(`/api/integration/products`);
    } catch (error) {
      this.logger.error('error getAllProductsFromTuvalum', error);
      return null;
    }
  }

  async getProduct(product_id: string): Promise<TuvalumProductDto | null> {
    const client = this.getClient();
    try {
      return await client<TuvalumProductDto>(
        `/api/integration/products/${product_id}`,
      );
    } catch (e: any) {
      const error = e as AxiosError;
      this.logger.error(error.response?.statusText, error);

      if ([404, 409].includes(error.response?.status ?? 400)) return null;

      throw new UnreachableExternalApiException(
        this.vendorConfigService.getVendorConfig().slug,
        'Could not reach API due to an error: ' + error.response?.statusText,
      );
    }
  }

  async isUp(): Promise<boolean> {
    try {
      const client = this.getClient();
      await client('/api/healthcheck');

      return true;
    } catch (e) {
      throw new Error('Tuvalum is down');
    }
  }

  getClient() {
    return createHttpClient(this.vendorConfigService.getVendorConfig().apiUrl, {
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
    });
  }
}
