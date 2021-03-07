import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
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
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/action.enum';
import { CheckPolicies, PoliciesGuard } from 'src/common/policies.guard';

@ApiTags('users')
@UseGuards(JwtAuthGuard)
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

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.List, UserEntity))
  @Get()
  findAll(): string {
    return this.usersService.findAll();
  }

  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get logged in user' })
  @ApiResponse({ status: 200, type: User })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  @Get('me')
  findMe(@User() user: UserEntity): UserEntity {
    return user;
  }

  @Get(':id')
  async findOne(@User() user: UserEntity, @Param('id') id: string) {
    const foundUser = await this.usersService.findOne(id);
    const ability = this.caslAbilityFactory.createForUser(user);

    if (ability.can(Action.Read, foundUser)) {
      return this.usersService.findOne(id);
    } else {
      throw new ForbiddenException();
    }
  }

  // @Put(':id')
  // update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
  //   return this.usersService.update(+id, updateUserDto);
  // }

  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, UserEntity),
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
