import { Op } from "sequelize";
import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import type { ISearchableRepository } from "../../../../shared/domain/repository/repository.interface";
import { UUID } from "../../../../shared/value-objects/uuid.value-object";
import { Category } from "../../../domain/category.entity";
import {
  CategorySearchResult,
  type CategorySearchParams,
} from "../../../domain/category.repository";
import type { CategoryModel } from "./category.model";

export class CategorySequelizeRepository
  implements ISearchableRepository<Category, UUID>
{
  sortableFields: string[] = ["name", "created_at"];

  constructor(private categoryModel: typeof CategoryModel) {}

  async insert(entity: Category): Promise<void> {
    await this.categoryModel.create({
      id: entity.id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  }

  async bulkInsert(entities: Category[]): Promise<void> {
    await this.categoryModel.bulkCreate(
      entities.map((entity) => ({
        id: entity.id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at,
      }))
    );
  }

  async update(entity: Category): Promise<void> {
    const category_id = entity.id.id;
    const model = await this.findById(new UUID(category_id));
    if (!model) {
      throw new NotFoundError(category_id, this.getEntity());
    }

    await this.categoryModel.update(
      {
        id: entity.id.id,
        name: entity.name,
        description: entity.description,
        is_active: entity.is_active,
        created_at: entity.created_at,
      },
      { where: { id: category_id } }
    );
  }

  async delete(category_id: UUID): Promise<void> {
    const model = await this.findById(category_id);
    if (!model) {
      throw new NotFoundError(category_id, this.getEntity());
    }

    await this.categoryModel.destroy({ where: { id: category_id.id } });
  }

  async findById(entity_id: UUID): Promise<Category | null> {
    const model = await this.categoryModel.findByPk(entity_id.id);

    if (!model) return null;

    return new Category({
      id: new UUID(model.id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    });
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => {
      return new Category({
        id: new UUID(model.id),
        name: model.name,
        description: model.description,
        is_active: model.is_active,
        created_at: model.created_at,
      });
    });
  }

  async search(props: CategorySearchParams): Promise<CategorySearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const { rows: models, count } = await this.categoryModel.findAndCountAll({
      ...(props.filter && {
        where: {
          name: { [Op.like]: `%${props.filter}` },
        },
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [["created_ate", "desc"]] }),
        offset,
        limit,
      }),
    });

    return new CategorySearchResult({
      items: models.map((model) => {
        return new Category({
          id: new UUID(model.id),
          name: model.name,
          description: model.description,
          is_active: model.is_active,
          created_at: model.created_at,
        });
      }),
      current_page: props.page,
      per_page: props.per_page,
      total: count,
    });
  }

  getEntity(): new (...args: any[]) => Category {
    return Category;
  }
}
