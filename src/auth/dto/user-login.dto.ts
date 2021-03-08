import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class UserLoginDto {
  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'jasonleibowitz' })
  username: string;

  @IsNotEmpty()
  @IsString()
  @ApiProperty({ example: 'password123' })
  password: string;
}
