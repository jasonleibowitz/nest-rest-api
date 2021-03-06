import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @Expose()
  firstName: string;

  @Column()
  lastName: string;

  @Expose()
  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  @Column()
  email: string;

  @Column()
  @Exclude()
  password: string;

  @Column()
  username: string;

  @Column({ default: false })
  isAdmin: boolean;
}
