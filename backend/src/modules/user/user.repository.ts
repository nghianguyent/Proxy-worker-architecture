import { Provider } from '@nestjs/common';
import { ProvidersName, Repositories } from 'src/common/enum/providers.enum';
import { DataSource } from 'typeorm';
import { User } from './entities/user.entity';

export const userRepositories: Provider[] = [
  {
    provide: Repositories.USER_REPOSITORY,
    useFactory: (datasource: DataSource) => datasource.getRepository(User),
    inject: [ProvidersName.DATA_SOURCE],
  },
];
