import { IsString, IsNumber, IsInt, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateProductDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @Type(() => Number)
  @IsNumber()
  price: number;

  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  @Type(() => Number)
  @IsInt()
  categoryId?: number;
}