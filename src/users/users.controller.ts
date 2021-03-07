import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User as UserEntity } from './entities/user.entity';
import { User } from './user.decorator';

import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/action.enum';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@User() user: UserEntity): string {
    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.can(Action.Read, 'all')) {
      return this.usersService.findAll();
    } else {
      throw new UnauthorizedException();
    }
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in user' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async findMe(@User() user: UserEntity): Promise<UserEntity> {
    const ability = this.caslAbilityFactory.createForUser(user);
    if (ability.can(Action.Read, user)) {
      // return req.user; -- Can just return the user from req. But client shouldn't have to even make this request
      return await this.usersService.findMe(user.id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const ability = this.caslAbilityFactory.createForUser(user);
    const foundUser = await this.usersService.findOne(id);

    if (ability.can(Action.Read, foundUser[0])) {
      return this.usersService.findOne(id);
    } else {
      throw new UnauthorizedException();
    }
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(+id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
