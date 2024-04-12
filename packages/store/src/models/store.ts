import { Store as MedusaStore } from '@medusajs/medusa';
import { Entity, OneToMany, Relation } from 'typeorm';
import { Product } from './product';
import { User } from './user';

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
