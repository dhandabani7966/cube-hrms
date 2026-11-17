import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { getDatabaseConfig } from '../config/database.config';
import { ENTITIES } from './entities';
import { DataStoreService } from './data-store.service';

const isDbEnabled = process.env.DB_ENABLED === 'true';

@Global()
@Module({
  imports: isDbEnabled
    ? [
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            ...getDatabaseConfig(),
            autoLoadEntities: true,
          }),
        }),
        TypeOrmModule.forFeature(ENTITIES),
      ]
    : [],
  providers: [DataStoreService],
  exports: [DataStoreService, ...(isDbEnabled ? [TypeOrmModule] : [])],
})
export class DatabaseModule {}
