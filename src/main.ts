import { ValidationPipe } from '@nestjs/common';
import { NestApplication, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import {join} from 'path';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';



async function bootstrap() {
  const app = await NestFactory.create<NestApplication>(AppModule);
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });
  app.enableCors();
  const config = new DocumentBuilder()
    .setTitle('E-Commerce API')
    .setDescription('API documentation for the E-Commerce application')
    .setVersion('1.0')
    .addTag('Authentication', 'User authentication and authorization endpoints')
    .addTag('Users', 'User management endpoints')
    .addTag('Categories', 'Product category management endpoints')
    .addTag('Products', 'Product management endpoints')
    .addTag('Product Images', 'Product image management endpoints')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();