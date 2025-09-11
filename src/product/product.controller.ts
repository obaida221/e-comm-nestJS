import { Controller, Get, Post, Body, Param, Put, Delete } from '@nestjs/common';
import { ProductsService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';

@Controller('products')
export class ProductController {
	constructor(private readonly productsService: ProductsService) {}

	@Post()
	create(@Body() dto: CreateProductDto) {
		return this.productsService.create(dto);
	}

	@Get()
	findAll() {
		return this.productsService.findAll();
	}

	@Get(':id')
	findOne(@Param('id') id: string) {
		return this.productsService.findOne(+id);
	}

	@Put(':id')
	update(@Param('id') id: string, @Body() dto: Partial<CreateProductDto>) {
		return this.productsService.update(+id, dto);
	}

	@Delete(':id')
	remove(@Param('id') id: string) {
		return this.productsService.remove(+id);
	}
}
