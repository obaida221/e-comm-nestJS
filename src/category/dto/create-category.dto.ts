import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
    @ApiProperty({
        description: 'Name of the category',
        example: 'Electronics',
        maxLength: 100
    })
    @IsString()
    name: string;

    @ApiProperty({
        description: 'Description of the category',
        example: 'Electronic devices and gadgets',
        required: false
    })
    @IsString()
    @IsOptional()
    description?: string;
}