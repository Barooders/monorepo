import { MegaMenuChunk } from '@/components/molecules/MegaMenu/shared/types/app/MegaMenu.types';
import { ProductMultiVariants as ProductCardPropsType } from '@/components/molecules/ProductCard/types';
import { PropsType as VendorHeaderPropsType } from './VendorPage/VendorHeader';

export type GetDataType = {
  parentCollections?: ParentCollectionType[];
  collectionData?: CollectionData | null;
  childCollections?: ChildCollectionType[];
  relatedCollections?: RelatedCollectionType[];
  highlightedProduct?: ProductCardPropsType | null;
  vendorInfo?: VendorHeaderPropsType | null;
  filters: string[];
  query: string;
  menuData: MegaMenuChunk;
};

export type ParentCollectionType = {
  id: string;
  handle: string;
  title: string;
  link: string;
};

export type ChildCollectionType = {
  imageUrl: string;
  title: string;
  shortName: string | null;
  handle: string;
};

export type RelatedCollectionType = {
  title: string;
  handle: string;
};

export type CollectionData = {
  title: string;
  id: number;
  handle: string;
  type: string;
  seo: {
    title: string;
    description: string;
  };
  image: {
    url: string | null;
    altText: string | null;
  } | null;
  descriptionHtml: string;
};
