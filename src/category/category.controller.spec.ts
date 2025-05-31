import { Test, TestingModule } from '@nestjs/testing';
import { CategoryController } from './category.controller';
import { DatabaseModule } from 'src/database/database.module';
import { CategoryModule } from './category.module';

describe('CategoryController', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [DatabaseModule, CategoryModule],
    }).compile();

    controller = module.get<CategoryController>(CategoryController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
