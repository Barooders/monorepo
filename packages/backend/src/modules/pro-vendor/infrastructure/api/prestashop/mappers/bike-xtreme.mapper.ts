import { Injectable } from '@nestjs/common';
import { PrestashopDefaultMapper } from './default.mapper';
import { FirstProductMapped } from '@modules/pro-vendor/domain/service/tag.service';
import { ProductFeature } from '../dto/prestashop-product.dto';
import { head } from 'lodash';

@Injectable()
export class BikeXtremeMapper extends PrestashopDefaultMapper {
   public async getExtraTags(productTitle: string, mappingMetadata: FirstProductMapped):Promise<string[]>{
    const brand = head(productTitle.split(' '));
    
     return super.generateSingleTag('brand', brand ?? 'first-word-not-found-in-title', mappingMetadata);
   }
}
