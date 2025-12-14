import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { ConfigModule } from '@nestjs/config';
import { JwtStrategyModule } from './jwt/jwt-strategy.module';
import { ProvidersName } from './common/enum/providers.enum';
import { JwtAuthGuard } from './common/guards/auth/jwt-auth.guard';

const customProviders = [
  {
    provide: ProvidersName.APP_GUARD,
    useClass: JwtAuthGuard,
  },
];
@Module({
  imports: [AuthModule, ConfigModule.forRoot(), JwtStrategyModule],
  controllers: [AppController],
  providers: [AppService, ...customProviders],
})
export class AppModule {}
