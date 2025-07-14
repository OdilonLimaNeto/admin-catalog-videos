import type { ListCategoryInput } from '@core/category/application/use.cases/list.category/list.category.use.case';
import type { SortDirection } from '@core/shared/domain/repository/search.params';

export class SearchCategoryDTO implements ListCategoryInput {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;

  constructor(props: ListCategoryInput) {
    this.page = props.page;
    this.per_page = props.per_page;
    this.sort = props.sort;
    this.sort_dir = props.sort_dir;
    this.filter = props.filter;
  }
}
