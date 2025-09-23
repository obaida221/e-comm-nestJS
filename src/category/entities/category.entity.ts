import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';
import { Product } from '../../products/entities/product.entity';

@Entity('categories')
export class Category {
    @ApiProperty({
        description: 'Unique identifier for the category',
        example: 1
    })
    @PrimaryGeneratedColumn()
    id: number;

    @ApiProperty({
        description: 'Name of the category',
        example: 'Electronics',
        maxLength: 100,
        uniqueItems: true
    })
    @Column({ length: 100, unique: true })
    name: string;

    @ApiProperty({
        description: 'Description of the category',
        example: 'Electronic devices and gadgets',
        required: false
    })
    @Column({ type: 'text', nullable: true })
    description?: string;

    @ApiProperty({
        description: 'URL of the category image',
        example: '/uploads/categories/1757982882664-916519863.jpg',
        required: false
    })
    @Column({ nullable: true })
    imageUrl: string;

    @ApiProperty({
        description: 'Date when the category was created',
        example: '2025-01-01T00:00:00.000Z'
    })
    @CreateDateColumn()
    createdAt: Date;

    @ApiProperty({
        description: 'Date when the category was last updated',
        example: '2025-01-01T00:00:00.000Z'
    })
    @UpdateDateColumn()
    updatedAt: Date;

    @ApiProperty({
        description: 'Products belonging to this category',
        type: () => [Product],
        required: false
    })
    @OneToMany(() => Product, product => product.category)
    products: Product[];
}