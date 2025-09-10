import { Injectable, NotFoundException,ConflictException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { User, UserRole } from "./entities/user.entity";
import * as bcrypt from 'bcrypt';


@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private usersRepository: Repository<User>,
    ) {}

    
    async create(createUserDto: CreateUserDto): Promise<User> {
        const { email, password, name, role } = createUserDto;  
        const existingUser = await this.usersRepository.findOne({ where: { email } });
        if (existingUser) {
            throw new ConflictException('Email already in use');
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = this.usersRepository.create({
            name: name,
            password: hashedPassword,
            email: email,
            role: role || UserRole.CUSTOMER,
        });
        await this.usersRepository.save(user);
        return user;
    }
    async findAll(): Promise<User[]> {
        return this.usersRepository.find();
    }
    async findOne(id: number): Promise<User> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return user;
    }
    async update(id: number, updateUserDto: UpdateUserDto): Promise<User> {
        const user = await this.usersRepository.preload({
            id: id,
            ...updateUserDto,
        });
        if (!user) {
            throw new NotFoundException('User not found');
        }
        return this.usersRepository.save(user);
    }
    async remove(id: number): Promise<void> {
        const user = await this.findOne(id);
        if (!user) {
            throw new NotFoundException('User not found');
        }
        await this.usersRepository.remove(user);
    }
}
