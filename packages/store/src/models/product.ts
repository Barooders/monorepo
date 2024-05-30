import { Product as MedusaProduct } from '@medusajs/medusa';
import { Column, Entity, Index } from 'typeorm';

@Entity()
export class Product extends MedusaProduct {
  @Index('ProductVendorId')
  @Column({ nullable: true })
  vendor_id?: string;
}
