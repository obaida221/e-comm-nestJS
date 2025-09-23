import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
    OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Category } from '../../category/entities/category.entity';
import { ProductImage } from '../../product-images/entities/product-image.entity';

@Entity('products')
export class Product {
    @ApiProperty({
        description: 'Unique identifier for the product',
        example: 1
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Name of the product',
        example: 'MacBook Pro',
        maxLength: 100,
        uniqueItems: true
    })
    @Column({ length: 100, unique: true })
    name: string;

    @ApiProperty({
        description: 'Description of the product',
        example: 'A high-performance laptop suitable for all your computing needs',
        required: false
    })
    @Column({ type: 'text', nullable: true })
    description?: string;

    @ApiProperty({
        description: 'Price of the product',
        example: 999.99,
        type: 'number',
        format: 'decimal'
    })
    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @ApiProperty({
        description: 'Stock quantity of the product',
        example: 50,
        minimum: 0
    })
    @Column({ type: 'int', default: 0 })
    stock: number;

    @ApiProperty({
        description: 'Date when the product was created',
        example: '2025-01-01T00:00:00.000Z'
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({
        description: 'Date when the product was last updated',
        example: '2025-01-01T00:00:00.000Z'
    })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({
        description: 'Category that this product belongs to',
        type: () => Category
    })
    @ManyToOne(() => Category, category => category.products, { eager: true, onDelete: 'SET NULL', nullable: true })
    @JoinColumn({ name: 'categoryId' })
    category: Category;

    @ApiProperty({
        description: 'ID of the category this product belongs to',
        example: 1
    })
    @Column()
    categoryId: number;

    @ApiProperty({
        description: 'Images associated with this product',
        type: () => [ProductImage],
        required: false
    })
    @OneToMany(() => ProductImage, (img) => img.product, { cascade: true })
    images?: ProductImage[];
}