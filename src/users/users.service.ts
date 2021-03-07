import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { UsersRepository } from './users.repository';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(UsersRepository) private userRepository: UsersRepository,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<Partial<User>> {
    return this.userRepository.createUser(createUserDto);
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
