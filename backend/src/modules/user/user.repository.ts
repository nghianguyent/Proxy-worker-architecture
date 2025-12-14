import { Provider } from '@nestjs/common';
import { ProvidersName, Repositories } from 'src/common/enum/providers.enum';
import { User } from 'src/entity/user.entity';
import { DataSource } from 'typeorm';

export const userRepositories: Provider[] = [
  {
    provide: Repositories.USER_REPOSITORY,
    useFactory: (datasource: DataSource) => datasource.getRepository(User),
    inject: [ProvidersName.DATA_SOURCE],
  },
];
