import { envName } from '@config/env/env-name.config';
import { Environments } from '@config/env/types';
import { mapCondition } from '@libs/domain/product.interface';
import { CONDITION_TAG_KEY } from '@libs/domain/types';
import { getTagsObject } from '@libs/helpers/shopify.helper';
import {
  SyncLightProduct,
  SyncProduct,
} from '@modules/pro-vendor/domain/ports/types';
import { IVendorConfigService } from '@modules/pro-vendor/domain/ports/vendor-config.service';
import { CategoryService } from '@modules/pro-vendor/domain/service/category.service';
import { TagService } from '@modules/pro-vendor/domain/service/tag.service';
import { TuvalumProductDto } from '@modules/pro-vendor/infrastructure/api/tuvalum/dto/tuvalum-product.input.dto';
import { Injectable, Logger } from '@nestjs/common';
import { head } from 'lodash';

@Injectable()
export class TuvalumMapper {
  private readonly logger = new Logger(TuvalumMapper.name);

  constructor(
    private categoryService: CategoryService,
    private tagService: TagService,
    private readonly vendorConfigService: IVendorConfigService,
  ) {}

  async mapperLight(
    tuvalumProduct: TuvalumProductDto,
  ): Promise<SyncLightProduct> {
    return {
      external_id: tuvalumProduct.uuid,
      title: tuvalumProduct.name,
      isVisibleInStore: true,
    };
  }

  async mapper(tuvalumProduct: TuvalumProductDto): Promise<SyncProduct | null> {
    const metadata = {
      externalId: tuvalumProduct.uuid,
      title: tuvalumProduct.name,
    };
    const generateBodyHTML = () => {
      let html = '';
      html += '<p>' + 'Marque: ' + tuvalumProduct.brand + '</p>';
      html += '<p>' + 'Modèle: ' + tuvalumProduct.model + '</p>';
      html += '<p>' + 'Matériel: ' + tuvalumProduct.material + '</p>';
      html += '<p>' + tuvalumProduct.size + '</p>';
      html += '<p><strong>Caractéristiques:</strong></p><ul>';
      for (const char of tuvalumProduct.characteristics) {
        html +=
          '<li>' +
          char.text +
          ': ' +
          char.value.replace('Tuvalum Certified', 'Très bon état') +
          '</li>';
      }
      html += '</ul><p><strong>Dommages esthétiques:</strong></p><ul>';
      for (const damage of tuvalumProduct.aesthetic_damages) {
        html += '<li>' + damage + '</li>';
      }
      html += '</ul>';
      html += '<p><strong>Garanties du vendeur :</strong><br></p>';
      html += '<ul>';
      html +=
        '<li>12 mois de garantie. La garantie couvre tout, à l’exception de l’usure, des dommages provoqués par des accidents et autres anomalies causées par une utilisation inadéquate du vélo ou un entretien insuffisant.</li>';
      html +=
        '<li>Le vélo est livré avec un certificat de garantie mécanique.</li>';
      html +=
        '<li>Tous les composants sont vérifiés et les consommables usés sont remplacés.</li>';
      html += '<li>La transmission est nettoyée par ultrasons.</li>';
      html +=
        '<li>Toute l’intégrité structurelle du cadre et de la fourche est vérifiée.</li>';
      html += '</ul>';
      html +=
        '<p>Avec Tubike, si vous n’êtes pas convaincu, vous disposez de 15 jours pour retourner votre vélo.</p>';
      return html;
    };

    const defineTags = async () => {
      const tags = [];
      for (const characteristic of tuvalumProduct.characteristics) {
        if (characteristic.key === 'brand') {
          tags.push('marque:' + characteristic.value);
          continue;
        }

        tags.push(
          ...(await this.tagService.getOrCreateTag(
            characteristic.text,
            characteristic.value,
            characteristic.key,
            this.vendorConfigService.getVendorConfig().mappingKey,
            metadata,
          )),
        );
      }

      tags.push(
        ...(await this.tagService.getOrCreateTag(
          'size',
          tuvalumProduct.size,
          'size',
          this.vendorConfigService.getVendorConfig().mappingKey,
          metadata,
        )),
      );
      tags.push(
        ...(await this.tagService.getOrCreateTag(
          'condition',
          tuvalumProduct.condition,
          'condition',
          this.vendorConfigService.getVendorConfig().mappingKey,
          metadata,
        )),
      );

      return tags;
    };

    const productType = await this.categoryService.getOrCreateCategory(
      String(tuvalumProduct.category_id),
      this.vendorConfigService.getVendorConfig().mappingKey,
      tuvalumProduct.category,
      metadata,
    );

    const mappedTags = await defineTags();

    // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
    if (!productType) {
      this.logger.warn(
        `Category ${tuvalumProduct.category_id} not mapped on product ${tuvalumProduct.uuid}`,
      );
      return null;
    }

    const tagsObject = getTagsObject(mappedTags);
    const productCondition = mapCondition(head(tagsObject[CONDITION_TAG_KEY]));

    const product: SyncProduct = {
      ...(await this.mapperLight(tuvalumProduct)),
      body_html: generateBodyHTML(),
      product_type: productType,
      // eslint-disable-next-line @typescript-eslint/strict-boolean-expressions
      tags: mappedTags.flatMap((f) => (f ? [f] : [])),
      EANCode: tuvalumProduct.ean,
      variants: [
        {
          external_id: tuvalumProduct.uuid,
          optionProperties: [
            {
              key: 'Taille',
              value: tuvalumProduct.size,
            },
          ],
          price: tuvalumProduct.price.toString(),
          sku: `${tuvalumProduct.uuid}${
            envName === Environments.LOCAL ? '-local' : ''
          }`,
          condition: productCondition,
          compare_at_price: tuvalumProduct.old_price?.toString(),
          inventory_quantity: this.getProductQuantity(tuvalumProduct),
        },
      ],
      images: [],
    };

    if (tuvalumProduct.files.length > 0) {
      product.images = tuvalumProduct.files.map((file: string) => {
        return {
          src: file,
        };
      });
    }

    return product;
  }

  getProductQuantity({ sold_out, is_available }: TuvalumProductDto): number {
    return sold_out || !is_available ? 0 : 1;
  }
}
