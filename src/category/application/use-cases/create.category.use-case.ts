import type { IUseCase } from "../../../shared/application/user-case.interface";
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
