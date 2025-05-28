import type { ISearchableRepository } from "../../shared/domain/repository/repository.interface";
import { SearchParams } from "../../shared/domain/repository/search.params";
import { SearchResult } from "../../shared/domain/repository/search.result";
import type { UUID } from "../../shared/value.objects/uuid.value.object";
import type { Category } from "./category.entity";

export type CategoryFilter = string;

export class CategorySearchParams extends SearchParams<CategoryFilter> {}

export class CategorySearchResult extends SearchResult<Category> {}

export interface ICategoryRepository
  extends ISearchableRepository<
    Category,
    UUID,
    CategoryFilter,
    CategorySearchParams,
    CategorySearchResult
  > {}
