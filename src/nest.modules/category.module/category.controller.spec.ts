import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { CategoryModule } from './category.module';
import { DatabaseModule } from 'src/nest.modules/database.module/database.module';
import { ConfigurationModule } from 'src/nest.modules/configuration.module/configuration.module';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigurationModule.forRoot(), DatabaseModule, CategoryModule],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
