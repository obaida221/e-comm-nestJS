
import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    Query
}
    from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UseGuards } from '@nestjs/common';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { User, UserRole } from './entities/user.entity';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { ApiOperation } from '@nestjs/swagger';
import { ApiResponse } from '@nestjs/swagger';
import { ApiBody } from '@nestjs/swagger';
import { error } from 'console';
import { ApiQuery } from '@nestjs/swagger';
import { ApiParam } from '@nestjs/swagger';


@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Post()
    @ApiOperation({
  summary: 'Create a new user',
  description: 'Creates a new user account'
})
@ApiBody({ type: CreateUserDto })
@ApiResponse({
  status: 201,
  description: 'User successfully created',
  type: User
})
@ApiResponse({
  status: 409,
  description: 'Email already exists'
})
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()

    @ApiOperation({
        summary: 'Get all users',
        description: 'Retrieves a list of all users'
    })
    @ApiResponse({
        status: 200,
        description: 'List of users retrieved successfully',
        type: [User]
    })
    async findAll(@Query('offset') offset: number = 1, @Query('limit') limit: number = 10) {
        return this.usersService.findAll(offset, limit);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get(':id')

    @ApiOperation({
        summary: 'Get a user by ID',
        description: 'Retrieves a user by their unique ID'
    })
    @ApiResponse({
        status: 200,
        description: 'User retrieved successfully',
        type: User
    })
    @ApiQuery({ name: 'id', required: true, description: 'Unique ID of the user', example: 1 })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })

    async findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Put(':id')
    @ApiOperation({
        summary: 'Update a user',
        description: 'Updates the details of an existing user'
    })
    @ApiParam({ name: 'id', required: true, description: 'Unique ID of the user', example: 1 })
    @ApiResponse({
        status: 200,
        description: 'User updated successfully',
        type: User
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.SUPER_ADMIN)
    @Delete(':id')
    @ApiOperation({
        summary: 'Delete a user',
        description: 'Deletes a user by their unique ID'
    })
    @ApiResponse({
        status: 200,
        description: 'User deleted successfully',
        schema: { example: { message: 'User deleted successfully' } }
    })
    @ApiResponse({
        status: 404,
        description: 'User not found'
    })
    async remove(@Param('id') id: number) {
        if (!id) {
            throw new error('User not found');
        }
        return this.usersService.remove(id);
    
    }

}
