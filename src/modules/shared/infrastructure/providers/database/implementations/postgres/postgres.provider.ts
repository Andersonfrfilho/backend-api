import { DataSource } from 'typeorm';

import { ConfigModule } from '@app/config/config.module';

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async (configModule: ConfigModuleIn) => {
      const dataSource = new DataSource({
        type: configMModule,
        host: 'localhost',
        port: 5432,
        username: 'root',
        password: 'root',
        database: 'test',
        entities: [__dirname + '/../**/*.entity{.ts,.js}'],
        synchronize: true,
      });

      return dataSource.initialize();
    },
    imports: [ConfigModule],
  },
];
