import { EntityValidationError } from '../../../../../shared/domain/validators/validation.error';
import { UUID } from '../../../../../shared/value.objects/uuid.value.object';
import { Category } from '../../../../domain/category.entity';
import { CategoryModel } from '../category.model';

export class CategoryModelMapper {
  static toModel(entity: Category): CategoryModel {
    return CategoryModel.build({
      id: entity.id.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });
  }

  static toEntity(model: CategoryModel): Category {
    const category = new Category({
      id: new UUID(model.id),
      name: model.name,
      description: model.description,
      is_active: model.is_active,
      created_at: model.created_at,
    });

    category.validate();
    if (category.notification.hasErrors()) {
      throw new EntityValidationError(category.notification.toJSON());
    }
    return category;
  }
}
