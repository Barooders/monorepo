import { Amount, Stock, URL } from '@libs/domain/value-objects';

export type XMLProduct = {
  id: string;
  type: string;
  title: string;
  description: string;
  images: URL[];
  variants: {
    id: string;
    condition: string;
    price: Amount;
    compareAtPrice?: Amount;
    inventoryQuantity: Stock;
    option1?: { key: string; value: string };
    option2?: { key: string; value: string };
    option3?: { key: string; value: string };
  }[];
  tags: { key: string; value: string }[];
  EANCode?: string;
};
