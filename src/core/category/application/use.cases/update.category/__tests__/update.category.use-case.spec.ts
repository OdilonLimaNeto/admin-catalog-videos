import { NotFoundError } from '../../../../../shared/domain/errors/not.found.error';
import {
  InvalidUUIDError,
  UUID,
} from '../../../../../shared/value.objects/uuid.value.object';
import { Category } from '../../../../domain/category.entity';
import { CategoryInMemoryRepository } from '../../../../infra/database/in.memory/category.in.memory.repository';
import { UpdateCategoryUseCase } from '../update.category.use.case';

describe('UpdateCategoryUseCase Unit Tests', () => {
  let useCase: UpdateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new UpdateCategoryUseCase(repository);
  });

  test('should throw an error when category is not valid', async () => {
    const input = new Category({ name: 't'.repeat(256) });
    await repository.insert(input);
    await expect(() =>
      useCase.execute({
        id: input.id.id,
        name: 't'.repeat(256),
      }),
    ).rejects.toThrow('Entity Validation Error');
  });

  test('should throws error when entity not found', async () => {
    await expect(() =>
      useCase.execute({ id: 'fake id', name: 'fake name' }),
    ).rejects.toThrow(new InvalidUUIDError());

    const uuid = new UUID();

    await expect(() =>
      useCase.execute({ id: uuid.id, name: 'fake name' }),
    ).rejects.toThrow(new NotFoundError(uuid.id, Category));
  });

  test('should update a category', async () => {
    const spyUpdate = jest.spyOn(repository, 'update');
    const category = new Category({ name: 'Category 1' });
    repository.items = [category];
    let output = await useCase.execute({
      id: category.id.id,
      name: 'Category 1 Updated',
    });
    expect(spyUpdate).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: category.id.id,
      name: 'Category 1 Updated',
      description: null,
      is_active: true,
      created_at: category.created_at,
    });

    type Arrange = {
      input: {
        id: string;
        name: string;
        description?: string | null;
        is_active?: boolean;
      };
      expected: {
        id: string;
        name: string;
        description: string | null;
        is_active: boolean;
        created_at: Date;
      };
    };

    const arrange: Arrange[] = [
      {
        input: {
          id: category.id.id,
          name: 'Category 1 Updated Again',
          description: 'some description',
        },
        expected: {
          id: category.id.id,
          name: 'Category 1 Updated Again',
          description: 'some description',
          is_active: true,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.id.id,
          name: 'Category 1 Updated Again',
          description: 'some description',
          is_active: true,
        },
        expected: {
          id: category.id.id,
          name: 'Category 1 Updated Again',
          description: 'some description',
          is_active: true,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.id.id,
          name: 'Category 1 Updated Again',
          is_active: false,
        },
        expected: {
          id: category.id.id,
          name: 'Category 1 Updated Again',
          description: 'some description',
          is_active: false,
          created_at: category.created_at,
        },
      },
      {
        input: {
          id: category.id.id,
          name: 'Category 1 Updated Again',
          description: 'some description',
          is_active: false,
        },
        expected: {
          id: category.id.id,
          name: 'Category 1 Updated Again',
          description: 'some description',
          is_active: false,
          created_at: category.created_at,
        },
      },
    ];

    for (const i of arrange) {
      output = await useCase.execute({
        id: i.input.id,
        ...('name' in i.input && { name: i.input.name }),
        ...('description' in i.input && { description: i.input.description }),
        ...('is_active' in i.input && { is_active: i.input.is_active }),
      });
      expect(output).toStrictEqual({
        id: i.expected.id,
        name: i.expected.name,
        description: i.expected.description,
        is_active: i.expected.is_active,
        created_at: i.expected.created_at,
      });
    }
  });
});
