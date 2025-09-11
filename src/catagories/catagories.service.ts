import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCatagoryDto } from './dto/create-catagory.dto';
import { Catagory } from './entities/catagory.entity';
@Injectable()
export class CatagoriesService {
  constructor(
    @InjectRepository(Catagory)
    private readonly catagoryRepository: Repository<Catagory>,
  ) {}

  //  1-create()
  //  2-findAll()
  //  3-findOne()
  //  4-update()
  //  5-remove()

  async create(CreateCatagoryDto: CreateCatagoryDto): Promise<Catagory> {
    const { title, describtion } = CreateCatagoryDto;
    const existingCatagory = await this.catagoryRepository.findOne({
      where: { title: title },
    });

    if (existingCatagory) {
      throw new ConflictException('Catagory already exists');
    }

    const catagory = this.catagoryRepository.create({
      title: title,
      describtion: describtion,
    });
    return this.catagoryRepository.save(catagory);
  }

  async findAll(offset: number = 1, limit: number = 10): Promise<{}> {
    const [data, count] = await this.catagoryRepository.findAndCount({
      skip: offset,
      take: limit,
      order: { createdAt: 'DESC' },
    });
    return {
      data,
      count,
    };
  }
  async findOne(id: number): Promise<Catagory> {
    const catagory = await this.catagoryRepository.findOne({
      where: { id: id },
    });
    if (!catagory) {
      throw new NotFoundException('Catagory not found');
    }
    return catagory;
  }
  async update(
    id: number,
    updateData: Partial<CreateCatagoryDto>,
  ): Promise<Catagory> {
    const catagory = await this.findOne(id);
    if (!catagory) {
      throw new NotFoundException(`Catagory with id ${id} not found`);
    }
    const { title, describtion } = updateData;
    if (title && title !== catagory.title) {
      const existingCatagory = await this.catagoryRepository.findOne({
        where: { title },
      });
      if (existingCatagory) {
        throw new ConflictException('Catagory title already exists');
      }
    }
    if (title !== undefined) catagory.title = title;
    if (describtion !== undefined) catagory.describtion = describtion;
    return this.catagoryRepository.save(catagory);
  }

  async remove(id: number): Promise<{ message: string }> {
    const catagory = await this.findOne(id);
    await this.catagoryRepository.remove(catagory);
    return { message: 'Catagory deleted successfully' };
  }
}
