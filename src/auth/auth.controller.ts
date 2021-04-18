import { Controller, Post, UseGuards, Body } from '@nestjs/common';

// Shared
import { LocalAuthGuard } from './guards/local-auth.guard';
import { Public } from '../const';

// Auth Domain
import { AuthService } from './auth.service';

// User Domain
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { User } from '../users/entities/user.entity';
import { UserLoginDto } from './dto/user-login.dto';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private usersService: UsersService,
  ) {}

  @ApiOperation({ summary: 'Login' })
  @ApiCreatedResponse({ description: 'Logged In Successfully' })
  @ApiUnauthorizedResponse({ description: 'Unauthorized' })
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto) {
    return this.authService.login(userLoginDto);
  }

  @ApiOperation({ summary: 'User Sign Up' })
  @ApiCreatedResponse({ description: 'User Created Successfully', type: User })
  @Public()
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
