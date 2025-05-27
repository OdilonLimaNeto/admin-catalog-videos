import type { IUseCase } from "../../../shared/application/user-case.interface";
import { UUID } from "../../../shared/value-objects/uuid.value-object";
import type { ICategoryRepository } from "../../domain/category.repository";
import { Category } from "../../domain/category.entity";
import { NotFoundError } from "../../../shared/domain/errors/not-found.error";
import {
  CategoryOutputMapper,
  type CategoryOutput,
} from "./common/category.output";

export class GetCategoryUseCase
  implements IUseCase<GetCategoryInput, GetCategoryOutput>
{
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: GetCategoryInput): Promise<GetCategoryOutput> {
    const uuid = new UUID(input.id);
    const category = await this.repository.findById(uuid);

    if (!category) throw new NotFoundError(uuid, Category);

    return CategoryOutputMapper.toOutput(category);
  }
}

export type GetCategoryInput = { id: string };

export type GetCategoryOutput = CategoryOutput;
