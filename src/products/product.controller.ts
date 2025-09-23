import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';
import { 
  ApiTags,
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiQuery, 
  ApiParam 
} from '@nestjs/swagger';

@ApiTags('Products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) { }

  @Post()
  @ApiOperation({ 
    summary: 'Create a new product',
    description: 'Creates a new product with the provided information'
  })
  @ApiBody({ type: CreateProductDto })
  @ApiResponse({ 
    status: 201, 
    description: 'Product created successfully',
    type: Product
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  @ApiResponse({
    status: 409,
    description: 'Product name already exists'
  })
  async create(@Body() createproductDto: CreateProductDto) {
    return this.productService.create(createproductDto);
  }

  @Get()
  @ApiOperation({ 
    summary: 'Get all products with pagination',
    description: 'Retrieves a paginated list of all products'
  })
  @ApiQuery({ name: 'offset', required: false, type: Number, description: 'Number of items to skip', example: 0 })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Maximum number of items to return', example: 10 })
  @ApiResponse({ 
    status: 200, 
    description: 'List of products retrieved successfully',
    type: [Product]
  })
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.productService.findAll(offset, limit);
  }
  @Get(':id')
  @ApiOperation({ 
    summary: 'Get a product by ID',
    description: 'Retrieves a specific product by its unique identifier'
  })
  @ApiParam({ name: 'id', type: Number, description: 'Unique identifier of the product', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product retrieved successfully',
    type: Product
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async findOne(@Param('id') id: number) {
    return this.productService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ 
    summary: 'Update a product by ID',
    description: 'Updates an existing product by its unique identifier'
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the product to update', example: 1 })
  @ApiBody({ type: UpdateProductDto })
  @ApiResponse({ 
    status: 200, 
    description: 'Product updated successfully',
    type: Product
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  @ApiResponse({ status: 400, description: 'Invalid input data' })
  async update(
    @Param('id') id: number,
    @Body() updateproductDto: UpdateProductDto,
  ) {
    return this.productService.update(id, updateproductDto);
  }

  @Delete(':id')
  @ApiOperation({ 
    summary: 'Delete a product by ID',
    description: 'Deletes a product by its unique identifier'
  })
  @ApiParam({ name: 'id', type: Number, description: 'ID of the product to delete', example: 1 })
  @ApiResponse({ 
    status: 200, 
    description: 'Product deleted successfully',
    schema: {
      example: {
        message: 'Product deleted successfully'
      }
    }
  })
  @ApiResponse({ status: 404, description: 'Product not found' })
  async remove(@Param('id') id: number) {
    return this.productService.remove(id);
  }
}