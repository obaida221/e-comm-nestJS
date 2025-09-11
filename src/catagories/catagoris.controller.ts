import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
} from '@nestjs/common';
import { CatagoriesService } from './catagories.service';
import { CreateCatagoryDto } from './dto/create-catagory.dto';
import { UpdateCatagoryDto } from './dto/update-catagory.dto';

@Controller('catagories')
export class CatagoriesController {
  constructor(private readonly CatagoriesService: CatagoriesService) {}
  //  1-create()
  // 2-findAll()
  // 3-findOne()
  // 4-update()
  // 5-remove()

  @Post()
  create(@Body() CreateCatagoryDto: CreateCatagoryDto) {
    return this.CatagoriesService.create(CreateCatagoryDto);
  }
  @Get()
  findAll(@Query('offset') offset?: number, @Query('limit') limit?: number) {
    return this.CatagoriesService.findAll(offset, limit);
  }
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.CatagoriesService.findOne(+id);
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() UpdateCatagoryDto: Partial<UpdateCatagoryDto>,
  ) {
    return this.CatagoriesService.update(id, UpdateCatagoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
    return this.CatagoriesService.remove(id);
  }
}
