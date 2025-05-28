import type { IUseCase } from "../../../../shared/application/use.case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not.found.error";
import { UUID } from "../../../../shared/value.objects/uuid.value.object";
import { Category } from "../../../domain/category.entity";
import type { ICategoryRepository } from "../../../domain/category.repository";
import {
  CategoryOutputMapper,
  CategoryOutput,
} from "../common/category.output";

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
