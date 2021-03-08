import {
  BaseEntity,
  Column,
  Entity,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
@Unique(['username', 'email'])
export class User extends BaseEntity {
  @PrimaryGeneratedColumn('uuid')
  @ApiProperty({
    example: 'eaa895f3-2f5c-40ab-bfd3-3086d7240c13',
    description: "User's unique UUID",
  })
  id: string;

  @Column()
  @Expose()
  @ApiProperty({ example: 'Jason', description: "The user's first name" })
  firstName: string;

  @Column()
  @ApiProperty({ example: 'Leibowitz', description: "The user's last name" })
  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column()
  @ApiProperty({
    example: 'jason@leibowitz.me',
    description: "The user's email",
  })
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  @ApiProperty({ example: 'jasonleibowitz', description: "The user's uername" })
  username: string;

  @Expose({ groups: ['admin'] })
  @Column({ default: false })
  isAdmin: boolean;
}
