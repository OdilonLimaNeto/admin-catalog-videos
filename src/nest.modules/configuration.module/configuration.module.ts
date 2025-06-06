import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import Joi from 'joi';
import { join } from 'path';

type DATABASE_SCHEMA_TYPE = {
  DB_VENDOR: 'mysql' | 'sqlite' | 'postgres';
  DB_HOST: string;
  DB_PORT: number;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_DATABASE: string;
  DB_LOGGING: boolean;
  DB_AUTO_LOAD_MODELS: boolean;
};

export type CONFIG_DATABASE_SCHEMA_TYPE = DATABASE_SCHEMA_TYPE;

export const CONFIG_DATABASE_SCHEMA: Joi.StrictSchemaMap<DATABASE_SCHEMA_TYPE> =
  {
    DB_VENDOR: Joi.string().required().valid('mysql', 'sqlite'),
    DB_HOST: Joi.string().required(),
    DB_DATABASE: Joi.string().when('DB_VENDOR', {
      is: 'mysql',
      then: Joi.required(),
    }),
    DB_USERNAME: Joi.string().when('DB_VENDOR', {
      is: 'mysql',
      then: Joi.required(),
    }),
    DB_PASSWORD: Joi.string().when('DB_VENDOR', {
      is: 'mysql',
      then: Joi.required(),
    }),
    DB_PORT: Joi.number().integer().when('DB_VENDOR', {
      is: 'mysql',
      then: Joi.required(),
    }),
    DB_LOGGING: Joi.boolean().required(),
    DB_AUTO_LOAD_MODELS: Joi.boolean().required(),
  };

@Module({})
export class ConfigurationModule extends ConfigModule {
  static forRoot(options: ConfigModuleOptions = {}) {
    const { envFilePath, ...otherOptions } = options;
    return super.forRoot({
      isGlobal: true,
      envFilePath: [
        ...(Array.isArray(envFilePath) ? envFilePath : [envFilePath]),
        join(
          process.cwd(),
          'environments',
          `.environment.${process.env.NODE_ENV}`,
        ),
        join(process.cwd(), 'environments', `.environment`),
      ],
      validationSchema: Joi.object<DATABASE_SCHEMA_TYPE>({
        ...CONFIG_DATABASE_SCHEMA,
      }),
      ...otherOptions,
    });
  }
}
