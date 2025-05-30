import type { IUseCase } from '../../../../shared/application/use.case.interface';
import { EntityValidationError } from '../../../../shared/domain/validators/validation.error';
import { Category } from '../../../domain/category.entity';
import type { ICategoryRepository } from '../../../domain/category.repository';
import {
  CategoryOutputMapper,
  CategoryOutput,
} from '../common/category.output';
import type { CreateCategoryInput } from './create.category.input';

export class CreateCategoryUseCase
  implements IUseCase<CreateCategoryInput, CreateCategoryOutput>
{
  constructor(private readonly repository: ICategoryRepository) {}
  async execute(input: CreateCategoryInput): Promise<CreateCategoryOutput> {
    const category = Category.create(input);

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.repository.insert(category);

    return CategoryOutputMapper.toOutput(category);
  }
}

export type CreateCategoryOutput = CategoryOutput;
