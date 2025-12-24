import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ProvidersName } from 'src/common/enum/providers.enum';
import { DataSource } from 'typeorm';

export const databaseProviders: Provider[] = [
  {
    provide: ProvidersName.DATA_SOURCE,
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USERNAME'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_DB'),
        ssl: {
          rejectUnauthorized: false,
        },
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
        extra: {
          connectionLimit: 4,
        },
      });

      return dataSource.initialize();
    },
    inject: [ConfigService],
  },
];
