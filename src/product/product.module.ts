import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Catagory } from '../catagories/entities/catagory.entity';
import { ProductsService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, Catagory])],
  controllers: [ProductController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
