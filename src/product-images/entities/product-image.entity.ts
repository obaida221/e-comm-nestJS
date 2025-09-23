import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

@Entity('product_images')
export class ProductImage {
  @ApiProperty({
    description: 'Unique identifier for the product image',
    example: 1
  })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({
    description: 'Product that this image belongs to',
    type: () => Product
  })
  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ApiProperty({
    description: 'ID of the product this image belongs to',
    example: 1
  })
  @Column({ name: 'product_id' })
  productId: number;

  @ApiProperty({
    description: 'URL of the image',
    example: '/uploads/product-images/1757984019309-864761166.jpg'
  })
  @Column({ name: 'image_url', type: 'text' })
  imageUrl: string;

  @ApiProperty({
    description: 'Whether this is the primary image for the product',
    example: false,
    default: false
  })
  @Column({ name: 'is_primary', default: false })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Alternative text for the image',
    example: 'Product front view',
    required: false
  })
  @Column({ name: 'alt_text', type: 'varchar', length: 255, nullable: true })
  altText?: string;

  @ApiProperty({
    description: 'Date when the image was created',
    example: '2025-01-01T00:00:00.000Z'
  })
  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @ApiProperty({
    description: 'Date when the image was last updated',
    example: '2025-01-01T00:00:00.000Z'
  })
  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
