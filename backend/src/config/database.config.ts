import { DataSource, DataSourceOptions } from 'typeorm';
import { ENTITIES } from '../database/entities';

export const getDatabaseConfig = (): DataSourceOptions => {
  return {
    type: 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    username: process.env.DB_USER || 'cubeai_admin',
    password: process.env.DB_PASSWORD || 'cubeai_secret_pass',
    database: process.env.DB_NAME || 'cubeai_hrms',
    entities: ENTITIES,
    synchronize: process.env.TYPEORM_SYNCHRONIZE === 'true',
    logging: process.env.NODE_ENV === 'development',
    migrations: [__dirname + '/../database/migrations/*.{ts,js}'],
    extra: {
      max: parseInt(process.env.DB_POOL_MAX || '20', 10),
      connectionTimeoutMillis: 5000,
    },
  };
};

export const AppDataSource = new DataSource(getDatabaseConfig());
