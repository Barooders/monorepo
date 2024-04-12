import { User as MedusaUser } from '@medusajs/medusa';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  Relation,
} from 'typeorm';
import { Store } from './store';

@Entity()
export class User extends MedusaUser {
  @Index('UserStoreId')
  @Column({ nullable: true })
  store_id?: string;

  @ManyToOne(() => Store, (store) => store.users)
  @JoinColumn({ name: 'store_id' })
  store: Relation<Store>;
}
