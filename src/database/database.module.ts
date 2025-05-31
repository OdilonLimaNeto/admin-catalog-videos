import { CategoryModel } from '@core/category/infra/database/sequelize/category.model';
import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';

const models = [CategoryModel];

@Module({
  imports: [
    SequelizeModule.forRoot({
      dialect: 'sqlite' as any,
      host: ':memory:',
      logging: false,
      models,
    }),
  ],
  controllers: [],
  providers: [],
})
export class DatabaseModule {}
