import { IsString, IsOptional, IsInt, IsNumber, IsPositive } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
export class CreateProductDto {
      @ApiProperty({
    description: 'Name of the product',
    example: 'Laptop',
    maxLength: 100,
  })
    @IsString()
    name: string;

    @ApiProperty({ description: 'A brief description of the product', 
        required: false,
        example: 'A high-performance laptop suitable for all your computing needs'
     })
    @IsString()
    @IsOptional()
    description?: string;

    @ApiProperty({ description: 'The price of the product', example: 999.99, examples: [49.99, 199.99, 999.99] })
    @IsNumber()
    @IsPositive()
    price: number;

    @ApiProperty({ description: 'The stock quantity of the product', example: 50, examples: [10, 20, 50] })
    @IsInt()
    @IsPositive()
    stock: number;
    @ApiProperty({ description: 'The category ID the product belongs to', example: 1, examples: [1, 2, 3] })
    @IsInt()
    @IsPositive()
    categoryId: number;
}