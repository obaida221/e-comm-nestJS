import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateProductImageDto {
  @ApiProperty({
    description: 'ID of the product this image belongs to',
    example: 1,
    type: 'number'
  })
  @Type(() => Number)
  @IsNumber()
  productId: number;

  @ApiProperty({
    description: 'URL of the image',
    example: '/uploads/product-images/1757984019309-864761166.jpg',
    required: false
  })
  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Whether this is the primary image for the product',
    example: false,
    required: false,
    default: false
  })
  @Type(()=>Boolean)  
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @ApiProperty({
    description: 'Alternative text for the image',
    example: 'Product front view',
    required: false
  })
  @IsString()
  @IsOptional()
  altText?: string;
}
