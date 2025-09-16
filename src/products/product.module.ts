import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';
import { Product } from './entities/product.entity';
import { CategoryModule } from '../category/category.module';
import {ProductImagesModule} from '../product-images/product-images.module'

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CategoryModule, forwardRef(() => ProductImagesModule)],
  controllers: [ProductController],
  providers: [ProductService],
  exports: [ProductService],
})
export class ProductModule { }