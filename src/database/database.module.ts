import { CategoryModel } from '@core/category/infra/database/sequelize/category.model';
import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { SequelizeModule } from '@nestjs/sequelize';
import type { CONFIG_DATABASE_SCHEMA_TYPE } from 'src/configuration/configuration.module';

const models = [CategoryModel];

@Module({
  imports: [
    SequelizeModule.forRootAsync({
      useFactory: (
        configService: ConfigService<CONFIG_DATABASE_SCHEMA_TYPE>,
      ) => {
        const DB_VENDOR = configService.get('DB_VENDOR');
        if (DB_VENDOR === 'sqlite') {
          return {
            dialect: 'sqlite',
            host: configService.get('DB_HOST'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          };
        }
        if (DB_VENDOR === 'mysql') {
          return {
            dialect: 'mysql',
            host: configService.get('DB_HOST'),
            port: configService.get('DB_PORT'),
            username: configService.get('DB_USERNAME'),
            password: configService.get('DB_PASSWORD'),
            database: configService.get('DB_DATABASE'),
            models,
            logging: configService.get('DB_LOGGING'),
            autoLoadModels: configService.get('DB_AUTO_LOAD_MODELS'),
          };
        }

        throw new Error(`Unsupported database configuration: ${DB_VENDOR}`);
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
