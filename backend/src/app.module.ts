import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtStrategyModule } from './jwt/jwt-strategy.module';
import { ProvidersName } from './common/enum/providers.enum';
import { JwtAuthGuard } from './common/guards/auth/jwt-auth.guard';
import { UserModule } from './modules/user/user.module';
import { JwtModule } from '@nestjs/jwt';
import { uuidv7 } from 'uuidv7';
import { RequestInterceptor } from './inteceptor/request.interceptor';

const customProviders = [
  {
    provide: ProvidersName.APP_GUARD,
    useClass: JwtAuthGuard,
  },
  {
    provide: ProvidersName.APP_INTERCEPTOR,
    useClass: RequestInterceptor,
  },
];

@Module({
  imports: [
    AuthModule,
    ConfigModule.forRoot(),
    JwtStrategyModule,
    UserModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('TOKEN_SECRET'),
        signOptions: {
          expiresIn: '60s',
          algorithm: 'HS256',
          jwtid: uuidv7(),
          issuer: configService.get<string>('APP_URL'),
          audience: configService.get<string>('APP_URL'),
        },
      }),
      global: true,
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController],
  providers: [AppService, ...customProviders],
  exports: [JwtModule],
})
export class AppModule {}
