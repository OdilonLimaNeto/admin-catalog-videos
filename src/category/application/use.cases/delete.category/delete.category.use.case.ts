import type { IUseCase } from "../../../../shared/application/use.case.interface";
import { UUID } from "../../../../shared/value.objects/uuid.value.object";
import type { ICategoryRepository } from "../../../domain/category.repository";

export class DeleteCategoryUseCase
  implements IUseCase<DeleteCategoryInput, DeleteCategoryOutput>
{
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: DeleteCategoryInput): Promise<DeleteCategoryOutput> {
    const uuid = new UUID(input.id);

    await this.repository.delete(uuid);
  }
}

export type DeleteCategoryInput = { id: string };

export type DeleteCategoryOutput = void;
