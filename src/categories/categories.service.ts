import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './entities/category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectRepository(Category)
        private readonly categoryRepository: Repository<Category>,
    ) { }

    async create(createCategoryDto: CreateCategoryDto, image?: Express.Multer.File): Promise<Category> {
        const { title } = createCategoryDto;
        const existing = await this.categoryRepository.findOne({ where: { title } });
        if (existing) {
            throw new ConflictException('Category title already exists');
        }
    const category = this.categoryRepository.create(createCategoryDto as any) as unknown as Category;

    return await this.categoryRepository.save(category);
    }

    async findAll(offset: number = 1, limit: number = 10): Promise<{}> {
        const [data, count] = await this.categoryRepository.findAndCount({
            skip: offset,
            take: limit,
            order: { createdAt: 'DESC' },
        });
        return { data, count };
    }

    async findOne(id: number): Promise<Category> {
        const category = await this.categoryRepository.findOne({ where: { id: id } });

        if (!category) {
            throw new NotFoundException('Category not found');
        }

        return category;
    }

    async update(id: number, updateCategoryDto: UpdateCategoryDto): Promise<Category> {
        const category = await this.findOne(id);

        if (!category) {
            throw new NotFoundException(`Category with id ${id} not found`);
        }

        const { title } = updateCategoryDto;

        if (title && title !== category.title) {
            const existingCategory = await this.categoryRepository.findOne({
                where: { title },
            });
            if (existingCategory) {
                throw new ConflictException('Category title already exists');
            }
        }

        if (title !== undefined) category.title = title;

        return this.categoryRepository.save(category);
    }

    async remove(id: number): Promise<{ message: string }> {
        const category = await this.findOne(id);
        await this.categoryRepository.remove(category);
        return { message: 'Category deleted successfully' };
    }
}