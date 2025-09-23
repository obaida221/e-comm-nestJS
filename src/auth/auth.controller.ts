import { 
  Controller, 
  Post, 
  Body, 
  UseGuards, 
  Get, 
  HttpCode, 
  HttpStatus 
} from '@nestjs/common';
import { 
  ApiTags, 
  ApiOperation, 
  ApiResponse, 
  ApiBody, 
  ApiBearerAuth 
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import { ChangePasswordDto } from './dto/change-password.dto';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { RolesGuard } from './guards/roles.guard';
import { CurrentUser } from './decorators/current-user.decorator';
import { Roles } from './decorators/roles.decorator';
import { User, UserRole } from '../users/entities/user.entity';

@ApiTags('Authentication')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Register a new user',
    description: 'Creates a new user account with the provided information'
  })
  @ApiBody({ type: RegisterDto })
  @ApiResponse({
    status: 201,
    description: 'User successfully registered',
    schema: {
      example: {
        id: 1,
        name: 'John Doe',
        email: 'john@example.com',
        role: 'CUSTOMER',
        createdAt: '2025-01-01T00:00:00.000Z',
        updatedAt: '2025-01-01T00:00:00.000Z'
      }
    }
  })
  @ApiResponse({
    status: 409,
    description: 'Email already exists'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async register(@Body() registerDto: RegisterDto) {
    return await this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description: 'Authenticates a user and returns a JWT access token'
  })
  @ApiBody({ type: LoginDto })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    schema: {
      example: {
        access_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        user: {
          id: 1,
          name: 'John Doe',
          email: 'john@example.com',
          role: 'CUSTOMER'
        }
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async login(@Body() loginDto: LoginDto) {
    return await this.authService.login(loginDto);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Change user password',
    description: 'Allows authenticated users to change their password'
  })
  @ApiBearerAuth()
  @ApiBody({ type: ChangePasswordDto })
  @ApiResponse({
    status: 200,
    description: 'Password successfully changed',
    schema: {
      example: {
        message: 'Password changed successfully'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid token or current password'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid input data'
  })
  async changePassword(
    @CurrentUser() user: User,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    return await this.authService.changePassword(user.id, changePasswordDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({
    summary: 'Get user profile',
    description: 'Retrieves the profile information of the authenticated user'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    type: User
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  async getProfile(@CurrentUser() user: User) {
    return await this.authService.getUserProfile(user.id);
  }

  @Get('admin-only')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  @ApiOperation({
    summary: 'Admin only endpoint',
    description: 'Demo endpoint that requires admin role access'
  })
  @ApiBearerAuth()
  @ApiResponse({
    status: 200,
    description: 'Admin access granted',
    schema: {
      example: {
        message: 'This is an admin-only endpoint'
      }
    }
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized - Invalid or missing token'
  })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions'
  })
  async adminOnlyEndpoint() {
    return { message: 'This is an admin-only endpoint' };
  }
}