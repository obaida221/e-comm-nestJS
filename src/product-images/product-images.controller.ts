import { Controller, Post, Body, Get, Param, Put, Delete, UseInterceptors, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiParam, 
  ApiConsumes 
} from '@nestjs/swagger';
import { ProductImagesService } from './product-images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';
import { ProductImage } from './entities/product-image.entity';

@ApiTags('Product Images')
@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly service: ProductImagesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a product image',
    description: 'Creates a new product image entry'
  })
  @ApiBody({ type: CreateProductImageDto })
  @ApiResponse({
    status: 201,
    description: 'Product image created successfully',
    type: ProductImage
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async create(@Body() createDto: CreateProductImageDto) {
    return this.service.create(createDto);
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/product-images',
      filename: (req, file, cb) => {
        const unique = Date.now() + '-' + Math.round(Math.random() * 1e9);
        const ext = extname(file.originalname);
        cb(null, `${unique}${ext}`);
      },
    }),
  }))
  @ApiOperation({
    summary: 'Upload a product image',
    description: 'Uploads an image file and creates a product image entry'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        productId: {
          type: 'number',
          description: 'ID of the product this image belongs to',
          example: 1
        },
        isPrimary: {
          type: 'boolean',
          description: 'Whether this is the primary image for the product',
          example: false
        },
        altText: {
          type: 'string',
          description: 'Alternative text for the image',
          example: 'Product front view'
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Image file to upload'
        }
      },
      required: ['productId', 'image']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Product image uploaded and created successfully',
    type: ProductImage
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or file upload error'
  })
  async upload(@Body() createDto: CreateProductImageDto, @UploadedFile() file: Express.Multer.File) {
    const productId = Number(createDto.productId);
    const imageUrl = file ? `/uploads/product-images/${file.filename}` : createDto.imageUrl;
    return this.service.create({ 
      productId, 
      imageUrl, 
      isPrimary: createDto.isPrimary || false, 
      altText: createDto.altText 
    });
  }

  @Get('product/:productId')
  @ApiOperation({
    summary: 'Get images by product ID',
    description: 'Retrieves all images for a specific product'
  })
  @ApiParam({
    name: 'productId',
    type: String,
    description: 'ID of the product to get images for',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Product images retrieved successfully',
    type: [ProductImage]
  })
  @ApiResponse({
    status: 404,
    description: 'Product not found'
  })
  async findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(Number(productId));
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a product image by ID',
    description: 'Retrieves a specific product image by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the product image',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Product image retrieved successfully',
    type: ProductImage
  })
  @ApiResponse({
    status: 404,
    description: 'Product image not found'
  })
  async findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a product image',
    description: 'Updates an existing product image by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the product image',
    example: '1'
  })
  @ApiBody({ type: UpdateProductImageDto })
  @ApiResponse({
    status: 200,
    description: 'Product image updated successfully',
    type: ProductImage
  })
  @ApiResponse({
    status: 404,
    description: 'Product image not found'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async update(
    @Param('id') id: string, 
    @Body() updateDto: UpdateProductImageDto,
  ) {
    return this.service.update(Number(id), updateDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a product image',
    description: 'Deletes a product image by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    type: String,
    description: 'Unique identifier of the product image',
    example: '1'
  })
  @ApiResponse({
    status: 200,
    description: 'Product image deleted successfully',
    schema: {
      example: {
        message: 'Product image deleted successfully'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Product image not found'
  })
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
