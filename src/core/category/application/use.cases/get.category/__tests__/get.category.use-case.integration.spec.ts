import { NotFoundError } from '../../../../../shared/domain/errors/not.found.error';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';
import { UUID } from '../../../../../shared/value.objects/uuid.value.object';
import { Category } from '../../../../domain/category.entity';
import { CategoryModel } from '../../../../infra/database/sequelize/category.model';
import { CategorySequelizeRepository } from '../../../../infra/database/sequelize/category.sequelize.repository';
import { GetCategoryUseCase } from '../get.category.use.case';

describe('GetCategoryUseCase Integration Tests', () => {
  let useCase: GetCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new GetCategoryUseCase(repository);
  });

  test('should throws error when entity not found', async () => {
    const uuid = new UUID();
    await expect(() => useCase.execute(uuid)).rejects.toThrow(
      new NotFoundError(uuid, Category),
    );
  });

  test('should get a category', async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const output = await useCase.execute({ id: category.id.id });

    expect(output).toEqual({
      id: category.id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
