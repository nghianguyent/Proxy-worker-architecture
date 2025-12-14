import { Provider } from '@nestjs/common';
import { ProvidersName } from 'src/common/enum/providers.enum';
import { DataSource } from 'typeorm';

export const databaseProviders: Provider[] = [
  {
    provide: ProvidersName.DATA_SOURCE,
    useFactory: async () => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: 'localhost',
        port: 5432,
        username: 'postgres',
        password: 'postgres',
        database: 'proxy-app',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
  },
];
