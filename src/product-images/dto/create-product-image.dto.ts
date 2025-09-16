import { IsNumber, IsString, IsOptional, IsBoolean } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export class CreateProductImageDto {
  @Type(() => Number)
  @IsNumber()
  productId: number;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @Type(()=>Boolean)  
  @IsBoolean()
  @IsOptional()
  isPrimary?: boolean;

  @IsString()
  @IsOptional()
  altText?: string;
}
