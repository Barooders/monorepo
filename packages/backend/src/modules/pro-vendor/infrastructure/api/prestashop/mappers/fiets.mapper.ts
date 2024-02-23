import { SyncProduct } from '@modules/pro-vendor/domain/ports/types';
import { Injectable } from '@nestjs/common';
import { PrestashopDefaultMapper } from './default.mapper';

@Injectable()
export class FietsMapper extends PrestashopDefaultMapper {
  async map(prestashopProduct: any): Promise<SyncProduct | null> {
    const productMapped = await super.map(prestashopProduct);

    if (!productMapped) {
      return null;
    }

    productMapped.body_html = productMapped.body_html.replace(
      /<p>www\.Fiets\.fr.*?<\/p>/g,
      '',
    );
    productMapped.body_html = productMapped.body_html.replace(
      /<p>.*?.www\.fiets\.fr.*?<\/p>/g,
      '',
    );

    productMapped.body_html =
      productMapped.body_html +
      `<p>RandoVélo garantit tous les vélos de sa boutique (6 mois sur les vélos reconditionnés / 2 ans sur les produits neufs).</p>`;

    return productMapped;
  }
}
