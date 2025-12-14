import { Inject, Module } from '@nestjs/common';
import { JwtStrategy } from './jwt.strategy';
import { ConfigModule } from '@nestjs/config';
import { userRepositories } from 'src/modules/user/user.repository';
import { DatabaseModule } from 'src/database/database.module';
@Module({
  imports: [ConfigModule, DatabaseModule],
  providers: [JwtStrategy, ...userRepositories],
  exports: [JwtStrategy],
})
export class JwtStrategyModule {}
