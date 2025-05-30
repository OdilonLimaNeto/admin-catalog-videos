import { CategoryModel } from '../category.model';
import { Category } from '../../../../domain/category.entity';
import { CategoryModelMapper } from '../mappers/category.model.mapper';
import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { UUID } from '../../../../../shared/value.objects/uuid.value.object';
import { setupSequelize } from '../../../../../shared/infra/testing/helpers';

describe('CategoryModelMapper Integration Tests', () => {
  setupSequelize({ models: [CategoryModel] });

  test('should throws error when category is invalid', async () => {
    expect.assertions(2);
    const model = CategoryModel.build({
      id: 'b6935a7c-d7c6-4b11-963e-29a6488f518b',
      name: 't'.repeat(256), // Invalid name
      description: 'Category 1 description',
      is_active: true,
      created_at: new Date(),
    });

    try {
      CategoryModelMapper.toEntity(model);
      fail('The Category is valid, but it needs throw a EntityValidationError');
    } catch (error) {
      expect(error).toBeInstanceOf(EntityValidationError);
      expect((error as EntityValidationError).errors).toMatchObject([
        {
          name: ['name must be shorter than or equal to 255 characters'],
        },
      ]);
    }
  });

  test('should convert a Category entity to a CategoryModel', () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      id: 'b6935a7c-d7c6-4b11-963e-29a6488f518b',
      name: 'Category 1',
      description: 'Category 1 description',
      is_active: true,
      created_at,
    });
    const category = CategoryModelMapper.toEntity(model);
    expect(category.toJSON()).toStrictEqual(
      new Category({
        id: new UUID('b6935a7c-d7c6-4b11-963e-29a6488f518b'),
        name: 'Category 1',
        description: 'Category 1 description',
        is_active: true,
        created_at,
      }).toJSON(),
    );
  });

  test('should convert a CategoryModel to a Category', async () => {
    const created_at = new Date();
    const category = new Category({
      id: new UUID('b6935a7c-d7c6-4b11-963e-29a6488f518b'),
      name: 'Category 1',
      description: 'Category 1 description',
      is_active: true,
      created_at,
    });

    const model = CategoryModelMapper.toModel(category);
    expect(model.toJSON()).toStrictEqual(
      new CategoryModel({
        id: 'b6935a7c-d7c6-4b11-963e-29a6488f518b',
        name: 'Category 1',
        description: 'Category 1 description',
        is_active: true,
        created_at,
      }).toJSON(),
    );
  });
});
