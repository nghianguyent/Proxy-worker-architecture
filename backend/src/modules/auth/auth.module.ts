import { userRepositories } from './../user/user.repository';
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { DatabaseModule } from 'src/database/database.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [PassportModule, DatabaseModule, ConfigModule],
  providers: [AuthService, ...userRepositories],
  controllers: [AuthController],
})
export class AuthModule {}
