import {
  PaginationOutputMapper,
  type PaginationOutput,
} from '../../../../shared/application/pagination.output';
import type { IUseCase } from '../../../../shared/application/use.case.interface';
import type { SortDirection } from '../../../../shared/domain/repository/search.params';
import {
  CategorySearchParams,
  type CategoryFilter,
  type CategorySearchResult,
  type ICategoryRepository,
} from '../../../domain/category.repository';
import {
  CategoryOutputMapper,
  type CategoryOutput,
} from '../common/category.output';

export class ListCategoryUseCase
  implements IUseCase<ListCategoryInput, ListCategoryOutput>
{
  constructor(private readonly repository: ICategoryRepository) {}

  async execute(input: ListCategoryInput): Promise<ListCategoryOutput> {
    const params = new CategorySearchParams(input);

    const searchResult = await this.repository.search(params);

    return this.toOutput(searchResult);
  }

  private toOutput(searchResult: CategorySearchResult) {
    const { items: _items } = searchResult;

    const outputItems = _items.map((i) => CategoryOutputMapper.toOutput(i));

    return PaginationOutputMapper.toOutput(outputItems, searchResult);
  }
}

export type ListCategoryInput = {
  page?: number;
  per_page?: number;
  sort?: string | null;
  sort_dir?: SortDirection | null;
  filter?: CategoryFilter | null;
};

export type ListCategoryOutput = PaginationOutput<CategoryOutput>;
