import { EntityRepository, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  HttpException,
  HttpStatus,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  private logger = new Logger('Users Repository');
  async createUser(createUserDto: CreateUserDto): Promise<User> {
    const { firstName, lastName, username, email, password } = createUserDto;
    const user = new User();
    user.firstName = firstName;
    user.lastName = lastName;
    user.username = username;
    user.email = email;

    try {
      user.password = await bcrypt.hash(password, 10);
    } catch (err) {
      throw new HttpException(
        'Error creating password hash',
        HttpStatus.BAD_GATEWAY,
      );
    }

    try {
      await user.save();
    } catch (err) {
      if (err.code === '23505') {
        this.logger.debug(
          `Request to create user with duplicate username, ${user.username}`,
        );
        throw new ConflictException('Username already exists');
      } else {
        this.logger.error(
          `Error saving user. User: ${JSON.stringify(user, null, 2)}`,
        );
        throw new InternalServerErrorException();
      }
    }

    return user;
  }
}
