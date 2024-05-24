import { CustomerRepository } from '@libs/domain/customer.repository';
import { IDescriptionParser } from '@modules/pro-vendor/domain/ports/description.parser';
import { IStoreClient } from '@modules/pro-vendor/domain/ports/store-client';
import { ITranslator } from '@modules/pro-vendor/domain/ports/translator';
import { ProductSyncService } from '@modules/pro-vendor/domain/product-sync.service';
import { CategoryService } from '@modules/pro-vendor/domain/service/category.service';
import { ProductMapper } from '@modules/pro-vendor/domain/service/product.mapper';
import { ProductService } from '@modules/pro-vendor/domain/service/product.service';
import { TagService } from '@modules/pro-vendor/domain/service/tag.service';
import { StockUpdateService } from '@modules/pro-vendor/domain/stock-update.service';
import { PrestashopDefaultMapper } from '@modules/pro-vendor/infrastructure/api/prestashop/mappers/default.mapper';
import { FietsMapper } from '@modules/pro-vendor/infrastructure/api/prestashop/mappers/fiets.mapper';
import { MatbikeMapper } from '@modules/pro-vendor/infrastructure/api/prestashop/mappers/matbike.mapper';
import { SanferbikeMapper } from '@modules/pro-vendor/infrastructure/api/prestashop/mappers/sanferbike.mapper';
import { SEMotionMapper } from '@modules/pro-vendor/infrastructure/api/prestashop/mappers/semotion.mapper';
import { PrestashopProductService } from '@modules/pro-vendor/infrastructure/api/prestashop/prestashop-product.service';
import { PrestashopClient } from '@modules/pro-vendor/infrastructure/api/prestashop/prestashop.client';
import { ChrisBikesClient } from '@modules/pro-vendor/infrastructure/api/shopify/clients/chris-bikes.client';
import { CyclinkClient } from '@modules/pro-vendor/infrastructure/api/shopify/clients/cyclink.client';
import { MintBikesClient } from '@modules/pro-vendor/infrastructure/api/shopify/clients/mint-bikes.client';
import { NordicsValueClient } from '@modules/pro-vendor/infrastructure/api/shopify/clients/nordics-value.client';
import { PastelClient } from '@modules/pro-vendor/infrastructure/api/shopify/clients/pastel.client';
import { ProjetBoussoleClient } from '@modules/pro-vendor/infrastructure/api/shopify/clients/projet-boussole.client';
import { TNCClient } from '@modules/pro-vendor/infrastructure/api/shopify/clients/tnc.client';
import { VeloMeldoisClient } from '@modules/pro-vendor/infrastructure/api/shopify/clients/velo-meldois.client';
import { BoussoleMapper } from '@modules/pro-vendor/infrastructure/api/shopify/mappers/boussole.mapper';
import { CyclinkMapper } from '@modules/pro-vendor/infrastructure/api/shopify/mappers/cyclink.mapper';
import { ShopifyDefaultMapper } from '@modules/pro-vendor/infrastructure/api/shopify/mappers/default.mapper';
import { MintMapper } from '@modules/pro-vendor/infrastructure/api/shopify/mappers/mint.mapper';
import { NordicsMapper } from '@modules/pro-vendor/infrastructure/api/shopify/mappers/nordics.mapper';
import { PastelMapper } from '@modules/pro-vendor/infrastructure/api/shopify/mappers/pastel.mapper';
import { TNCMapper } from '@modules/pro-vendor/infrastructure/api/shopify/mappers/tnc.mapper';
import { VeloMeldoisMapper } from '@modules/pro-vendor/infrastructure/api/shopify/mappers/velo-meldois.mapper';
import { ShopifyProductService } from '@modules/pro-vendor/infrastructure/api/shopify/shopify-product.service';
import { ShopifyClient } from '@modules/pro-vendor/infrastructure/api/shopify/shopify.client';
import { TuvalumMapper } from '@modules/pro-vendor/infrastructure/api/tuvalum/mappers/tuvalum.mapper';
import { TuvalumProductService } from '@modules/pro-vendor/infrastructure/api/tuvalum/tuvalum-product.service';
import { TuvalumClient as DeprecatedTuvalumClient } from '@modules/pro-vendor/infrastructure/api/tuvalum/tuvalum.client';
import { BikeFMapper } from '@modules/pro-vendor/infrastructure/api/woocommerce/mappers/bikef.mapper';
import { WooCommerceDefaultMapper } from '@modules/pro-vendor/infrastructure/api/woocommerce/mappers/default.mapper';
import { FastlapMapper } from '@modules/pro-vendor/infrastructure/api/woocommerce/mappers/fastlap.mapper';
import { JBikesMapper } from '@modules/pro-vendor/infrastructure/api/woocommerce/mappers/j-bikes.mapper';
import { MoulinAVelosMapper } from '@modules/pro-vendor/infrastructure/api/woocommerce/mappers/moulin-a-velos.mapper';
import { RecocycleMapper } from '@modules/pro-vendor/infrastructure/api/woocommerce/mappers/recocycle.mapper';
import { SBikesMapper } from '@modules/pro-vendor/infrastructure/api/woocommerce/mappers/sbikes.mapper';
import { WooCommerceProductService } from '@modules/pro-vendor/infrastructure/api/woocommerce/woocommerce-product.service';
import { WooCommerceClient } from '@modules/pro-vendor/infrastructure/api/woocommerce/woocommerce.client';
import { ChatGPTDescriptionParser } from '@modules/pro-vendor/infrastructure/parser/description.parser';
import { StoreClient } from '@modules/pro-vendor/infrastructure/store/store.client';
import { ChatGPTTranslator } from '@modules/pro-vendor/infrastructure/translator/translator';
import { Scope } from '@nestjs/common';
import { IInternalNotificationClient } from './domain/ports/internal-notification.client';
import { IVendorConfigService } from './domain/ports/vendor-config.service';
import { IVendorOrderServiceProvider } from './domain/ports/vendor-order-service.provider';
import { IVendorProductServiceProvider } from './domain/ports/vendor-product-service.provider';
import { CSVProductService } from './infrastructure/api/csv/csv-product.service';
import { CSVClient } from './infrastructure/api/csv/csv.client';
import { CSVMapper } from './infrastructure/api/csv/csv.mapper';
import { DefaultPrestashopClient } from './infrastructure/api/prestashop/clients/default.client';
import { FreeglisseClient } from './infrastructure/api/prestashop/clients/freeglisse.client';
import { MontaniniClient } from './infrastructure/api/prestashop/clients/montanini.client';
import { BikeXtremeMapper } from './infrastructure/api/prestashop/mappers/bike-xtreme.mapper';
import { FreeglisseMapper } from './infrastructure/api/prestashop/mappers/freeglisse.mapper';
import { FunbikeMapper } from './infrastructure/api/prestashop/mappers/funbike.mapper';
import { GemBikesMapper } from './infrastructure/api/prestashop/mappers/gem-bikes.mapper';
import { UsedEliteBikesMapper } from './infrastructure/api/prestashop/mappers/used-elite-bikes.mapper';
import { Velosport34Mapper } from './infrastructure/api/prestashop/mappers/velosport34.mapper';
import { PrestashopOrderService } from './infrastructure/api/prestashop/prestashop-order.service';
import { ScrapflyProductService } from './infrastructure/api/scrapping/scrapfly.product.service';
import { AllCyclesClient } from './infrastructure/api/shopify/clients/all-cycles.client';
import { BaroudeurClient } from './infrastructure/api/shopify/clients/baroudeur.client';
import { HbeClient } from './infrastructure/api/shopify/clients/hbe.client';
import { LoewiClient } from './infrastructure/api/shopify/clients/loewi.client';
import { PilatClient } from './infrastructure/api/shopify/clients/pilat.client';
import { SavoldelliClient } from './infrastructure/api/shopify/clients/savoldelli.client';
import { TechniCyclesClient } from './infrastructure/api/shopify/clients/techni-cycles.client';
import { TuvalumClient } from './infrastructure/api/shopify/clients/tuvalum.client';
import { WillemClient } from './infrastructure/api/shopify/clients/willem.client';
import { AllCyclesMapper } from './infrastructure/api/shopify/mappers/all-cycles.mapper';
import { BaroudeurMapper } from './infrastructure/api/shopify/mappers/baroudeur.mapper';
import { HbeMapper } from './infrastructure/api/shopify/mappers/hbe.mapper';
import { LoewiMapper } from './infrastructure/api/shopify/mappers/loewi.mapper';
import { PilatMapper } from './infrastructure/api/shopify/mappers/pilat.mapper';
import { SavoldelliMapper } from './infrastructure/api/shopify/mappers/savoldelli.mapper';
import { TechniCyclesMapper } from './infrastructure/api/shopify/mappers/techni-cycles.mapper';
import { WillemMapper } from './infrastructure/api/shopify/mappers/willem.mapper';
import { ShopifyOrderService } from './infrastructure/api/shopify/shopify-order.service';
import { BernaudeauMapper } from './infrastructure/api/woocommerce/mappers/bernaudeau.mapper';
import { DazBikeMapper } from './infrastructure/api/woocommerce/mappers/daz-bike.mapper';
import { LeHollandaisMapper } from './infrastructure/api/woocommerce/mappers/le-hollandais.mapper';
import { MontaniniMapper } from './infrastructure/api/woocommerce/mappers/montanini.mapper';
import { PanameBicisMapper } from './infrastructure/api/woocommerce/mappers/paname-bicis.mapper';
import { XMLProductService } from './infrastructure/api/xml/xml-product.service';
import { XMLClient } from './infrastructure/api/xml/xml.client';
import { XMLMapper } from './infrastructure/api/xml/xml.mapper';
import { VendorConfigService } from './infrastructure/config/vendor-config.service';
import { VendorOrderServiceProvider } from './infrastructure/config/vendor-order-service.provider';
import { VendorProductServiceProvider } from './infrastructure/config/vendor-product-service.provider';
import { SlackClient } from './infrastructure/internal-notification/slack.client';

export const proVendorSharedServices = [
  CustomerRepository,
  TuvalumMapper,
  PrestashopClient,
  DefaultPrestashopClient,
  FreeglisseClient,
  MontaniniClient,
  DeprecatedTuvalumClient,
  WooCommerceClient,
  MintBikesClient,
  CyclinkClient,
  HbeClient,
  PastelClient,
  TechniCyclesClient,
  WillemClient,
  TuvalumClient,
  LoewiClient,
  SavoldelliClient,
  BaroudeurClient,
  VeloMeldoisClient,
  ChrisBikesClient,
  PilatClient,
  AllCyclesClient,
  NordicsValueClient,
  ProjetBoussoleClient,
  TNCClient,
  CSVClient,
  XMLClient,
  ShopifyClient,
  {
    provide: IStoreClient,
    useClass: StoreClient,
  },
  {
    provide: IDescriptionParser,
    useClass: ChatGPTDescriptionParser,
  },
  {
    provide: ITranslator,
    useClass: ChatGPTTranslator,
  },
  ShopifyDefaultMapper,
  PrestashopDefaultMapper,
  FietsMapper,
  FreeglisseMapper,
  SEMotionMapper,
  FunbikeMapper,
  GemBikesMapper,
  UsedEliteBikesMapper,
  BikeXtremeMapper,
  MatbikeMapper,
  SanferbikeMapper,
  Velosport34Mapper,
  MintMapper,
  VeloMeldoisMapper,
  NordicsMapper,
  TNCMapper,
  BoussoleMapper,
  PilatMapper,
  CyclinkMapper,
  BaroudeurMapper,
  TechniCyclesMapper,
  HbeMapper,
  PastelMapper,
  LoewiMapper,
  SavoldelliMapper,
  AllCyclesMapper,
  WillemMapper,
  CSVMapper,
  XMLMapper,
  WooCommerceDefaultMapper,
  MoulinAVelosMapper,
  JBikesMapper,
  DazBikeMapper,
  LeHollandaisMapper,
  BikeFMapper,
  MontaniniMapper,
  PanameBicisMapper,
  BernaudeauMapper,
  SBikesMapper,
  RecocycleMapper,
  FastlapMapper,
  TagService,
  CategoryService,
  WooCommerceProductService,
  CSVProductService,
  XMLProductService,
  PrestashopProductService,
  PrestashopOrderService,
  ShopifyOrderService,
  TuvalumProductService,
  ShopifyProductService,
  ScrapflyProductService,
  ProductMapper,
  ProductService,
  StockUpdateService,
  ProductSyncService,
  {
    provide: IInternalNotificationClient,
    useClass: SlackClient,
  },
  {
    provide: IVendorConfigService,
    useClass: VendorConfigService,
    scope: Scope.REQUEST,
  },
  {
    provide: IVendorProductServiceProvider,
    useClass: VendorProductServiceProvider,
    scope: Scope.REQUEST,
  },
  {
    provide: IVendorOrderServiceProvider,
    useClass: VendorOrderServiceProvider,
    scope: Scope.REQUEST,
  },
];
