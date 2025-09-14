import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  Query,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path'

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) { }

  @Post()
  @UseInterceptors(FileInterceptor('image',{
    storage: diskStorage({
      destination:'./uploads/categories',
      filename:(req,file, callback)=>{
        const uniqueName = Date.now()+'-'+ Math.round(Math.random()* 1E9);
        const ext = extname(file.originalname);
        callback(null,`${uniqueName}${ext}`);
      },
    }),
  }))

  
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 5 * 1024 * 1024 })
        ],
        fileIsRequired: false,
      }),
    )
    image?: Express.Multer.File
  
  ) {
  return this.categoriesService.create(createCategoryDto, image);
  }

  @Get()
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
  return this.categoriesService.findAll(offset, limit);
  }

  @Get(':id')
  async findOne(@Param('id') id: number) {
  return this.categoriesService.findOne(id);
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
  return this.categoriesService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number) {
  return this.categoriesService.remove(id);
  }
}