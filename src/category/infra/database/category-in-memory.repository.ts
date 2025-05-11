import { InMemoryRepository } from "../../../shared/infra/database/in-memory/in-memory.repository";
import type { UUID } from "../../../shared/value-objects/uuid.value-object";
import { Category } from "../../domain/category.entity";

export class CategoryInMemoryRepository extends InMemoryRepository<
  Category,
  UUID
> {
  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
