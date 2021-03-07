import { Controller, Request, Post, UseGuards, Body } from '@nestjs/common';
import { Public } from '../const';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { CreateUserDto } from '../users/dto/create-user.dto';

import {
  ApiCreatedResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

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
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ summary: 'User Sign Up' })
  @ApiCreatedResponse({ description: 'User Created Successfully' })
  @Public()
  @Post('/register')
  async register(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
}
