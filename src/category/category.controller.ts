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
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiParam,
  ApiQuery,
  ApiConsumes
} from '@nestjs/swagger';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { Category } from './entities/category.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { extname } from 'path'

@ApiTags('Categories')
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) { }

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
  @ApiOperation({
    summary: 'Create a new category',
    description: 'Creates a new category with optional image upload'
  })
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        name: {
          type: 'string',
          description: 'Category name',
          example: 'Electronics'
        },
        description: {
          type: 'string',
          description: 'Category description',
          example: 'Electronic devices and gadgets'
        },
        image: {
          type: 'string',
          format: 'binary',
          description: 'Category image file (max 5MB)'
        }
      },
      required: ['name']
    }
  })
  @ApiResponse({
    status: 201,
    description: 'Category successfully created',
    type: Category
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data or file too large'
  })
  @ApiResponse({
    status: 409,
    description: 'Category name already exists'
  })
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
    return this.categoryService.create(createCategoryDto, image);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all categories',
    description: 'Retrieves a paginated list of all categories'
  })
  @ApiQuery({
    name: 'offset',
    required: false,
    type: Number,
    description: 'Number of items to skip',
    example: 0
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Maximum number of items to return',
    example: 10
  })
  @ApiResponse({
    status: 200,
    description: 'List of categories retrieved successfully',
    type: [Category]
  })
  async findAll(
    @Query('offset') offset: number = 0,
    @Query('limit') limit: number = 10,
  ) {
    return this.categoryService.findAll(offset, limit);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get a category by ID',
    description: 'Retrieves a specific category by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the category',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Category retrieved successfully',
    type: Category
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found'
  })
  async findOne(@Param('id') id: number) {
    return this.categoryService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({
    summary: 'Update a category',
    description: 'Updates an existing category by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the category',
    example: 1
  })
  @ApiBody({ type: UpdateCategoryDto })
  @ApiResponse({
    status: 200,
    description: 'Category updated successfully',
    type: Category
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async update(
    @Param('id') id: number,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ) {
    return this.categoryService.update(id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a category',
    description: 'Deletes a category by its unique identifier'
  })
  @ApiParam({
    name: 'id',
    type: Number,
    description: 'Unique identifier of the category',
    example: 1
  })
  @ApiResponse({
    status: 200,
    description: 'Category deleted successfully',
    schema: {
      example: {
        message: 'Category deleted successfully'
      }
    }
  })
  @ApiResponse({
    status: 404,
    description: 'Category not found'
  })
  async remove(@Param('id') id: number) {
    return this.categoryService.remove(id);
  }
}