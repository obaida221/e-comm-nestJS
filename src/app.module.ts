import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { CategoryModule } from './category/category.module';
import { ProductModule } from './products/product.module';
import { ProductImagesModule } from './product-images/product-images.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'Admin',
      database: 'e-com-nestJS',
      autoLoadEntities: true,
      synchronize: true, 
    }),
    UsersModule,
    ProductModule,
  ProductImagesModule,
    CategoryModule,],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
