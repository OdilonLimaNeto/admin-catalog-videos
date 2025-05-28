import type { IUseCase } from "../../../../shared/application/use.case.interface";
import { NotFoundError } from "../../../../shared/domain/errors/not.found.error";
import { EntityValidationError } from "../../../../shared/domain/validators/validation.error";
import { UUID } from "../../../../shared/value.objects/uuid.value.object";
import { Category } from "../../../domain/category.entity";
import type { ICategoryRepository } from "../../../domain/category.repository";
import {
  CategoryOutputMapper,
  CategoryOutput,
} from "../common/category.output";
import type { UpdateCategoryInput } from "./update.category.input";

export class UpdateCategoryUseCase
  implements IUseCase<UpdateCategoryInput, UpdateCategoryOutput>
{
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: UpdateCategoryInput): Promise<UpdateCategoryOutput> {
    const uuid = new UUID(input.id);

    const category = await this.repository.findById(uuid);

    if (!category) throw new NotFoundError(uuid, Category);

    input.name && category.changeName(input.name);

    if (input.description !== undefined)
      category.changeDescription(input.description);

    if (input.is_active === true) category.activate();

    if (input.is_active === false) category.deactivate();

    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }

    await this.repository.update(category);

    return CategoryOutputMapper.toOutput(category);
  }
}

export type UpdateCategoryOutput = CategoryOutput;
