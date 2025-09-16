import { 
  Injectable, 
  UnauthorizedException, 
  ConflictException, 
  BadRequestException 
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { JwtPayload } from './strategies/jwt.strategy';
import { UsersService } from '../users/users.service';


@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
    private usersService: UsersService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{ user: Partial<User>; access_token: string }> {
        const { email, password, name, role } = registerDto;
    
        // Check if user already exists
        const existingUser = await this.usersService.findByEmail(email);
        if (existingUser) {
          throw new ConflictException('User with this email already exists');
        }
        
        // Create user
        const user = await this.usersService.create({
          email,
          name,
          password: password,
          role,
        });
    
        // Generate JWT token
        const payload = { sub: user.id, email: user.email, role: user.role };
        const access_token = this.jwtService.sign(payload);
    
        // Return user without password
        const { password: _, ...userWithoutPassword } = user;
    
        return {
          user: userWithoutPassword,
          access_token,
        };
      }

 async login(loginDto: LoginDto): Promise<{ user: Partial<User>; access_token: string }> {
      const { email, password } = loginDto;
  
      // Find user by email
      const user = await this.usersService.findByEmail(email);
      if (!user) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid email or password');
      }
  
      // Generate JWT token
      const payload = { sub: user.id, email: user.email, role: user.role };
      const access_token = this.jwtService.sign(payload);
  
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
  
      return {
        user: userWithoutPassword,
        access_token,
      };
    }
 async changePassword(userId: number, changePasswordDto: ChangePasswordDto): Promise<{ message: string }> {
        const { currentPassword, newPassword } = changePasswordDto;
    
        // Find user
        const user = await this.usersService.getById(userId);
        if (!user) {
          throw new UnauthorizedException('User not found');
        }
    
        // Verify current password
        const isCurrentPasswordValid = await bcrypt.compare(currentPassword, user.password);
        if (!isCurrentPasswordValid) {
          throw new BadRequestException('Current password is incorrect');
        }
    
        // Hash new password
        const hashedNewPassword = await bcrypt.hash(newPassword, 12);
    
        // Update password
        await this.usersService.updatePassword(userId, hashedNewPassword);
    
        return { message: 'Password changed successfully' };
      }
  async validateUser(payload: JwtPayload): Promise<User> {
    const user = await this.usersService.findOne(payload.id );
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async getUserProfile(userId: number): Promise<User> {
    const user = await this.usersService.getById(userId);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    
    // Remove password from response
    const { password: _, ...userResponse } = user;
    return userResponse as User;
  }
}