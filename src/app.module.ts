import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TerminusModule } from '@nestjs/terminus';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { UsersController } from './users/users.controller';
import { configService } from './config/config.service';
import { HealthController } from './health/health.controller';

@Module({
  imports: [
    TerminusModule,
    TypeOrmModule.forRoot(configService.getTypeOrmConfig()),
    AuthModule,
    UsersModule,
  ],
  controllers: [UsersController, HealthController],
  providers: [],
})
export class AppModule {}
