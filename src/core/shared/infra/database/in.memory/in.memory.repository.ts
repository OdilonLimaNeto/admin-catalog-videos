import type { Entity } from '../../../domain/entity';
import { NotFoundError } from '../../../domain/errors/not.found.error';
import type {
  IRepository,
  ISearchableRepository,
} from '../../../domain/repository/repository.interface';
import type {
  SearchParams,
  SortDirection,
} from '../../../domain/repository/search.params';
import { SearchResult } from '../../../domain/repository/search.result';
import type { ValueObject } from '../../../domain/value.object';

export abstract class InMemoryRepository<
  E extends Entity,
  EntityId extends ValueObject,
> implements IRepository<E, EntityId>
{
  items: E[] = [];
  async insert(entity: E): Promise<void> {
    this.items.push(entity);
  }

  async bulkInsert(entities: E[]): Promise<void> {
    this.items.push(...entities);
  }

  async update(entity: E): Promise<void> {
    const index = this.items.findIndex((item) =>
      item.entity_id.equals(entity.entity_id),
    );
    if (index === -1) {
      throw new NotFoundError(entity.entity_id, this.getEntity());
    }

    this.items[index] = entity;
  }

  async delete(id: EntityId): Promise<void> {
    const index = this.items.findIndex((item) => item.entity_id.equals(id));
    if (index === -1) {
      throw new NotFoundError(id, this.getEntity());
    }
    this.items.splice(index, 1);
  }

  async findById(id: EntityId): Promise<E | null> {
    const index = this.items.find((item) => item.entity_id.equals(id));
    return typeof index === 'undefined' ? null : index;
  }

  async findAll(): Promise<E[]> {
    return this.items;
  }
  abstract getEntity(): new (...args: any[]) => E;
}

export abstract class InMemorySearchableRepository<
    E extends Entity,
    EntityId extends ValueObject,
    Filter = string,
  >
  extends InMemoryRepository<E, EntityId>
  implements ISearchableRepository<E, EntityId, Filter>
{
  sortableFields: string[] = [];
  async search(props: SearchParams<Filter>): Promise<SearchResult<E>> {
    const itemsFiltered = await this.applyFilter(this.items, props.filter);

    const itemsSorted = this.applySort(
      itemsFiltered,
      props.sort,
      props.sort_dir,
    );

    const itemsPaginated = this.applyPaginate(
      itemsSorted,
      props.page,
      props.per_page,
    );

    return new SearchResult({
      items: itemsPaginated,
      total: itemsSorted.length,
      current_page: props.page,
      per_page: props.per_page,
    });
  }

  protected abstract applyFilter(
    items: E[],
    filter: Filter | null,
  ): Promise<E[]>;
  protected applyPaginate(
    items: E[],
    page: SearchParams['page'],
    per_page: SearchParams['per_page'],
  ) {
    const start = (page - 1) * per_page; // 0 * 15 = 15
    const limit = start + per_page; // 0 + 15 = 15
    return items.slice(start, limit); // [0, 15]
  }

  protected applySort(
    items: E[],
    sort: string | null,
    sort_dir: SortDirection | null,
    custom_getter?: (sort: string, item: E) => any,
  ) {
    if (!sort || !this.sortableFields.includes(sort)) {
      return items;
    }

    return [...items].sort((a, b) => {
      //@ts-ignore
      const aValue = custom_getter ? custom_getter(sort, a) : a[sort];
      //@ts-ignore
      const bValue = custom_getter ? custom_getter(sort, b) : b[sort];

      if (aValue < bValue) {
        return sort_dir === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return sort_dir === 'asc' ? 1 : -1;
      }
      return 0;
    });
  }
}
