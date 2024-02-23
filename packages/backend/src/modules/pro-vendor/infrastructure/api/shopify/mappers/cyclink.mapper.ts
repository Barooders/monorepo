import { Condition } from '@libs/domain/prisma.main.client';
import { Injectable } from '@nestjs/common';
import { IMetafield, IProduct } from 'shopify-api-node';
import { ShopifyDefaultMapper } from './default.mapper';

@Injectable()
export class CyclinkMapper extends ShopifyDefaultMapper {
  async getExternalCategory(
    { product_type }: IProduct,
    _productMetafields: IMetafield[],
  ): Promise<string> {
    return product_type;
  }

  getDescription(
    shopifyProduct: IProduct,
    _productMetafields: IMetafield[],
    _productType: string | null,
    mappedTags: string[],
  ): string {
    const isNewProduct =
      super.getProductCondition(shopifyProduct, mappedTags) ===
      Condition.AS_NEW;
    const additionalInfo = isNewProduct
      ? `<p>Tous nos vélos électriques sont contrôlés et testés par notre équipe de professionnels. Vous bénéficiez de 1 an de garantie sur le cadre et les éléments électriques comme la batterie et le moteur ; de quoi profiter sereinement de votre nouveau deux-roues.</p>`
      : `
    <p>Tous nos vélos électriques reconditionnés passent entre les mains de notre équipe de professionnels et sont garantis 1 an.</p>
    <p>50 POINTS DE CONTRÔLE *</p>
    <ul>
      <li>diagnostique électrique et mise à jour logiciel (les batteries sont testées et garanties à 90% de leur capacité)</li>
      <li>changement des disques et plaquettes de freins</li>
      <li>changement des pneumatiques</li>
      <li>changement des poignées, pédales et de la béquille centrale</li>
      <li>contrôle de la chaîne et réglage de la transmission</li>
      <li>changement des éclairages</li>
      <li>retouche esthétique</li>
    </ul>
    <p>* Le reconditionnement varie en fonction de l’état initial du vélo. Si les pièces sont fonctionnelles et en bon état, elles ne sont pas remplacées.</p>`;

    return `${shopifyProduct.body_html}<br>${additionalInfo}`;
  }
}
