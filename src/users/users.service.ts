import {
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    const user = new User();
    user.firstName = createUserDto.firstName;
    user.lastName = createUserDto.lastName;
    user.username = createUserDto.username;
    user.email = createUserDto.email;

    try {
      user.password = await bcrypt.hash(createUserDto.password, 10);
    } catch (err) {
      throw new HttpException(
        'Error creating password hash',
        HttpStatus.BAD_GATEWAY,
      );
    }

    const { firstName, lastName, username } = await this.userRepository.save(
      user,
    );
    return { firstName, lastName, username };
  }

  findAll() {
    return `This action returns all users`;
  }

  findOne(id: number) {
    return `This action returns #${id} user`;
  }

  async findMe(id: string): Promise<User> {
    const user = await this.userRepository.findOne(id);
    if (!user) throw new NotFoundException();
    return user;
  }

  findByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ username });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
