import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { ProductsService } from './product.service';
import { ProductController } from './product.controller';
import { CatagoriesModule } from '../catagories/catagories.module';

@Module({
  imports: [TypeOrmModule.forFeature([Product]), CatagoriesModule],
  controllers: [ProductController],
  providers: [ProductsService],
  exports: [ProductsService],
})
export class ProductsModule {}
