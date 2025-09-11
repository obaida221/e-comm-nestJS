import { Module } from '@nestjs/common';
import { CatagoriesService } from './catagories.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Catagory } from './entities/catagory.entity';
import { CatagoriesController } from './catagoris.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Catagory])],
  controllers: [CatagoriesController],
  providers: [CatagoriesService],
})
export class CatagoriesModule {}
