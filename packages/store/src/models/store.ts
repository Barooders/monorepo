import { Store as MedusaStore } from '@medusajs/medusa';
import { Entity, OneToMany, Relation } from 'typeorm';
import { Product } from './product';
import { User } from './user';

// Not in use right now, products are linked to vendors with vendor id
@Entity()
export class Store extends MedusaStore {
  @OneToMany(() => User, (user) => user.store, {
    cascade: true,
  })
  users: Relation<Product>[];

  @OneToMany(() => Product, (product) => product.store, {
    cascade: true,
  })
  products: Relation<Product>[];
}
