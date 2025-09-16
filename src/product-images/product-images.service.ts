import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductImage } from './entities/product-image.entity';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly repo: Repository<ProductImage>,
  ) {}

  async create(data: Partial<ProductImage>): Promise<ProductImage> {
  const img = this.repo.create(data as any) as unknown as ProductImage;
  return this.repo.save(img);
  }

  async findByProduct(productId: number): Promise<ProductImage[]> {
    return this.repo.find({ where: { productId } });
  }

  async findOne(id: number): Promise<ProductImage> {
    const img = await this.repo.findOne({ where: { id } });
    if (!img) throw new NotFoundException('Image not found');
    return img;
  }

  async update(id: number, data: Partial<ProductImage>): Promise<ProductImage> {
    const img = await this.findOne(id);
    Object.assign(img, data);
    return this.repo.save(img);
  }

  async remove(id: number): Promise<{ message: string }> {
    const img = await this.findOne(id);
    await this.repo.remove(img);
    return { message: 'Image deleted' };
  }
}
