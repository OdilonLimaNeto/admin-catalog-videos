import { Module } from '@nestjs/common';
import { ConfigModule, ConfigModuleOptions } from '@nestjs/config';
import { join } from 'path';

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
        join(process.cwd(), '.environments', `.environment`),
      ],
      ...otherOptions,
    });
  }
}
