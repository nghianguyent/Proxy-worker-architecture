import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { userRepositories } from '../user/user.repository';
import { DatabaseModule } from 'src/database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { uuidv7 } from 'uuidv7';

@Module({
  imports: [
    PassportModule,
    DatabaseModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
        signOptions: {
          expiresIn: '60s',
          algorithm: 'HS256',
          jwtid: uuidv7(),
          issuer: configService.get<string>('APP_URL'),
          audience: configService.get<string>('PUBLIC_APP_URL'),
        },
      }),

      inject: [ConfigService],
    }),
  ],
  providers: [AuthService, ...userRepositories],
  controllers: [AuthController],
})
export class AuthModule {}
