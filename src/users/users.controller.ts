
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



@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) { }
    @Post()
    async create(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }
    // @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
    @Get()
    async findAll(@Query('offset') offset: number = 1, @Query('limit') limit: number = 10) {
        return this.usersService.findAll(offset, limit);
    }
    @Get(':id')
    async findOne(@Param('id') id: number) {
        return this.usersService.findOne(id);
    }
    @Put(':id')
    async update(@Param('id') id: number, @Body() updateUserDto: UpdateUserDto) {
        return this.usersService.update(id, updateUserDto);
    }
    @Delete(':id')
    async remove(@Param('id') id: number) {
        return this.usersService.remove(id);
    }

}
