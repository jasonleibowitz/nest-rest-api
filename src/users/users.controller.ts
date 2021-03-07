import {
  Body,
  Controller,
  Delete,
  ForbiddenException,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBadGatewayResponse,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiInternalServerErrorResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

// Shared
import { AppAbility, CaslAbilityFactory } from 'src/casl/casl-ability.factory';
import { Action } from 'src/casl/action.enum';
import { Auth } from 'src/common/auth.guard';
import { CheckPolicies, PoliciesGuard } from 'src/common/policies.guard';

// User Domain
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { User as UserEntity } from './entities/user.entity';
import { User } from './user.decorator';

@ApiTags('users')
@Auth()
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @ApiOperation({ summary: 'Create a new user' })
  @ApiBadGatewayResponse({ description: 'Error creating password hash' })
  @ApiConflictResponse({ description: 'Username already exists' })
  @ApiInternalServerErrorResponse({ description: 'Something went wrong' })
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @ApiOperation({ summary: 'Get all users' })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.List, UserEntity))
  @Get()
  findAll(): Promise<UserEntity[]> {
    return this.usersService.findAll();
  }

  @ApiOperation({ summary: 'Get logged in user' })
  @ApiForbiddenResponse({
    description: 'You are not authorized to perform that action',
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) => ability.can(Action.Read, UserEntity))
  @Get('me')
  findMe(@User() user: UserEntity): UserEntity {
    return user;
  }

  @ApiOperation({ summary: 'Get user by userId' })
  @ApiForbiddenResponse({
    description: 'You are not authorized to perform that action',
  })
  @ApiNotFoundResponse({ description: 'That user was not found' })
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

  @ApiForbiddenResponse({
    description: 'You are not authorized to perform that action',
  })
  @UseGuards(PoliciesGuard)
  @CheckPolicies((ability: AppAbility) =>
    ability.can(Action.Delete, UserEntity),
  )
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
