import type { CategoryOutput } from '@core/category/application/use.cases/common/category.output';
import type { ListCategoryOutput } from '@core/category/application/use.cases/list.category/list.category.use.case';
import { Transform } from 'class-transformer';
import { CollectionPresenter } from 'src/nest.modules/shared.module/presenters/collection.presenter';

export class CategoryPresenter {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  @Transform(({ value }: { value: Date }) => value.toISOString())
  created_at: Date;

  constructor(output: CategoryOutput) {
    this.id = output.id;
    this.name = output.name;
    this.description = output.description;
    this.is_active = output.is_active;
    this.created_at = output.created_at;
  }
}

export class CategoryCollectionPresenter extends CollectionPresenter {
  data: CategoryPresenter[];

  constructor(output: ListCategoryOutput) {
    const { items, ...pagination } = output;
    super(pagination);
    this.data = items.map((item) => new CategoryPresenter(item));
  }
}
