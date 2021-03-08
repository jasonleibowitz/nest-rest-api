import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Jason' })
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'Leibowitz' })
  lastName: string;

  @IsEmail()
  @ApiProperty({ example: 'user@test.com' })
  email: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password123' })
  password: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'myusername' })
  username: string;
}
