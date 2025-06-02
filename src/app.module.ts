import { Module } from '@nestjs/common';
import { CategoryModule } from './nest.modules/category.module/category.module';
import { DatabaseModule } from './nest.modules/database.module/database.module';
import { ConfigurationModule } from './nest.modules/configuration.module/configuration.module';
import { SharedModule } from './nest.modules/shared.module/shared.module';

@Module({
  imports: [
    ConfigurationModule.forRoot(),
    DatabaseModule,
    CategoryModule,
    SharedModule,
  ],
})
export class AppModule {}
