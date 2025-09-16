import { Controller, Post, Body, Get, Param, Put, Delete, UseInterceptors, UploadedFile, UsePipes, ValidationPipe } from '@nestjs/common';
import { ProductImagesService } from './product-images.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { CreateProductImageDto } from './dto/create-product-image.dto';
import { UpdateProductImageDto } from './dto/update-product-image.dto';

@Controller('product-images')
export class ProductImagesController {
  constructor(private readonly service: ProductImagesService) {}

  @Post()
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
  async findByProduct(@Param('productId') productId: string) {
    return this.service.findByProduct(Number(productId));
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.service.findOne(Number(id));
  }

  @Put(':id')
  async update(
    @Param('id') id: string, 
    @Body() updateDto: UpdateProductImageDto,
  ) {
    return this.service.update(Number(id), updateDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return this.service.remove(Number(id));
  }
}
