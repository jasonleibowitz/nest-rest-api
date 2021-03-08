import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { configService } from './config/config.service';
import { HealthModule } from './health/health.module';
import { CaslModule } from './casl/casl.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
    HealthModule,
    CaslModule,
  ],
  providers: [],
})
export class AppModule {}
