import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DefaultPrestashopClient {
  constructor(private readonly vendorConfigService: IVendorConfigService) {}

  public async fetchPrestashop(
    path: string,
    options: RequestInit,
  ): Promise<Response> {
    const url = new URL(
      `${this.vendorConfigService.getVendorConfig().apiUrl}${path}`,
    );
    const vendorAPIKey = this.vendorConfigService.getVendorConfig().apiKey;
    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (vendorAPIKey) url.searchParams.append('ws_key', vendorAPIKey);
    url.searchParams.append('output_format', 'JSON');

    return await fetch(url, options);
  }
}
