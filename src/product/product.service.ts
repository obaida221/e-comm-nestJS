import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  //  1-create()
  //  2-findAll()
  //  3-findOne()
  //  4-update()
  //  5-remove()

  async create(CreateProductDto: CreateProductDto): Promise<Product> {
    const { name, description, price, stock } = CreateProductDto;
    const existingProduct = await this.productRepository.findOne({
      where: { name: name },
    });

    if (existingProduct) {
      throw new ConflictException('Product already exists');
    }

    const product = this.productRepository.create({
      name: name,
      description: description,
      price: price,
      stock: stock,
    });
    return this.productRepository.save(product);
  }

  async findAll(offset: number = 1, limit: number = 10): Promise<{}> {
    const [data, count] = await this.productRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      count,
    };
  }
  async findOne(id: number): Promise<Product> {
    const product = await this.productRepository.findOne({
      where: { id: id },
    });
    if (!product) {
      throw new NotFoundException('Product not found');
    }
    return product;
  }
  async update(
    id: number,
    updateData: Partial<CreateProductDto>,
  ): Promise<Product> {
    const product = await this.findOne(id);
    if (!product) {
      throw new NotFoundException(`Product with id ${id} not found`);
    }
    const { name, description, price, stock } = updateData;
    if (name && name !== product.name) {
      const existingProduct = await this.productRepository.findOne({
        where: { name  },
      });
      if (existingProduct) {
        throw new ConflictException('Product name already exists');
      }
    }
    if (description !== undefined) product.description = description;
    if (price !== undefined) product.price = price;
    if (stock !== undefined) product.stock = stock;
    return this.productRepository.save(product);
  }

  async remove(id: number): Promise<{ message: string }> {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
    return { message: 'Product deleted successfully' };
  }
}
