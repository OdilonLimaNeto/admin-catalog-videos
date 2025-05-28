import type { IUseCase } from "../../../shared/application/user-case.interface";
import { EntityValidationError } from "../../../shared/domain/validators/validation-error";
import { Category } from "../../domain/category.entity";
import type { ICategoryRepository } from "../../domain/category.repository";
import {
  CategoryOutputMapper,
  type CategoryOutput,
} from "./common/category.output";

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

export type CreateCategoryInput = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export type CreateCategoryOutput = CategoryOutput;
