import type { IRepository } from "../../shared/domain/repository/repository.interface";
import type { UUID } from "../../shared/value-objects/uuid.value-object";
import type { Category } from "./category.entity";

export interface ICategoryRepository extends IRepository<Category, UUID> {}
