import { CategoryController } from '../category.controller';
import type { CreateCategoryOutput } from '@core/category/application/use.cases/create.category/create.category.use.case';
import type { CreateCategoryDTO } from '../dto/create.category.dto';
import {
  CategoryCollectionPresenter,
  CategoryPresenter,
} from '../presenters/category.presenter';
import type { UpdateCategoryOutput } from '@core/category/application/use.cases/update.category/update.category.use.case';
import type { GetCategoryOutput } from '@core/category/application/use.cases/get.category/get.category.use.case';
import type { ListCategoryOutput } from '@core/category/application/use.cases/list.category/list.category.use.case';
import type { SortDirection } from '@core/shared/domain/repository/search.params';

// REFERENCE
// beforeEach(async () => {
//   const module: TestingModule = await Test.createTestingModule({
//     imports: [ConfigurationModule.forRoot({}), CategoryModule],
//   })
//     .overrideProvider(getModelToken(CategoryModel))
//     .useValue({})
//     .overrideProvider('CategoryRepository')
//     .useValue(CategoryInMemoryRepository)
//     .compile();

//   controller = module.get<CategoryController>(CategoryController);
// });

describe('CategoryController Unit Tests', () => {
  let controller: CategoryController;

  beforeEach(async () => {
    controller = new CategoryController();
  });

  test('should create a category', async () => {
    const output: CreateCategoryOutput = {
      id: '1',
      name: 'Category 1',
      description: 'Description 1',
      is_active: true,
      created_at: new Date(),
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };
    //@ts-expect-error defined part of methods
    controller['createCategoryUseCase'] = mockCreateUseCase;
    const input: CreateCategoryDTO = {
      name: 'Category 1',
      description: 'Description 1',
      is_active: true,
    };

    const presenter = await controller.create(input);
    expect(mockCreateUseCase.execute).toHaveBeenCalledWith(input);
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  test('should update a category', async () => {
    const id = '93c8b1f-1d67-4ff3-bf91-262573ab4807';
    const output: CreateCategoryOutput = {
      id,
      name: 'Category 1',
      description: 'Description 1',
      is_active: true,
      created_at: new Date(),
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['updateCategoryUseCase'] = mockUpdateUseCase;
    const input: Omit<UpdateCategoryOutput, 'id' | 'created_at'> = {
      name: 'Category 1',
      description: 'Description 1',
      is_active: true,
    };

    const presenter = await controller.update(id, input);
    expect(mockUpdateUseCase.execute).toHaveBeenCalledWith({ id, ...input });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  test('should delete a category', async () => {
    const expectedOutput = undefined;

    const mockDeleteUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(expectedOutput)),
    };

    //@ts-expect-error defined part of methods
    controller['deleteCategoryUseCase'] = mockDeleteUseCase;
    const id = '93c8b1f-1d67-4ff3-bf91-262573ab4807';
    expect(controller.remove(id)).toBeInstanceOf(Promise);
    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toHaveBeenCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  test('should get a category', async () => {
    const id = '93c8b1f-1d67-4ff3-bf91-262573ab4807';
    const output: GetCategoryOutput = {
      id,
      name: 'Category 1',
      description: 'Description 1',
      is_active: true,
      created_at: new Date(),
    };

    const mockGetUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['getCategoryUseCase'] = mockGetUseCase;

    const presenter = await controller.findOne(id);
    expect(mockGetUseCase.execute).toHaveBeenCalledWith({ id });
    expect(presenter).toBeInstanceOf(CategoryPresenter);
    expect(presenter).toStrictEqual(new CategoryPresenter(output));
  });

  test('should list categories', async () => {
    const output: ListCategoryOutput = {
      items: [
        {
          id: '93c8b1f-1d67-4ff3-bf91-262573ab4807',
          name: 'Category 1',
          description: 'Description 1',
          is_active: true,
          created_at: new Date(),
        },
      ],
      current_page: 1,
      last_page: 1,
      per_page: 1,
      total: 1,
    };
    const mockListUseCase = {
      execute: jest.fn().mockResolvedValue(Promise.resolve(output)),
    };

    //@ts-expect-error defined part of methods
    controller['listCategoryUseCase'] = mockListUseCase;

    const searchParams = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc' as SortDirection,
      filter: 'Category',
    };
    const presenter = await controller.search(searchParams);
    expect(presenter).toBeInstanceOf(CategoryCollectionPresenter);
    expect(mockListUseCase.execute).toHaveBeenCalledWith(searchParams);
    expect(presenter).toEqual(new CategoryCollectionPresenter(output));
  });
});
