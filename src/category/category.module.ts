import { Module } from '@nestjs/common';
import { CategoryController } from './category.controller';
import { getModelToken, SequelizeModule } from '@nestjs/sequelize';
import { CategorySequelizeRepository } from '@core/category/infra/database/sequelize/category.sequelize.repository';
import { CategoryModel } from '@core/category/infra/database/sequelize/category.model';

@Module({
  imports: [SequelizeModule.forFeature([CategoryModel])],
  controllers: [CategoryController],
  providers: [
    {
      provide: CategorySequelizeRepository,
      useFactory: (categoryModel: typeof CategoryModel) =>
        new CategorySequelizeRepository(categoryModel),
      inject: [getModelToken(CategoryModel)],
    },
  ],
})
export class CategoryModule {}
