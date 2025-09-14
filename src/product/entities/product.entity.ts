import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { ManyToOne, JoinColumn } from 'typeorm';
import { Catagory } from '../../catagories/entities/catagory.entity';

@Entity('Products')
export class Product {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100, unique: true })
  name: string;
  @Column({ length: 255 })
  description: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  stock: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Catagory, (catagory) => catagory.products, { onDelete: 'SET NULL', nullable: true ,eager:true})
  @JoinColumn({ name: 'catagoryId' })
  catagory?: Catagory | null;

  @Column({ nullable: true })
  catagoryId?: number | null;
}
