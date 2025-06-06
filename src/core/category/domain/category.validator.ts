import { MaxLength } from 'class-validator';
import type { Category } from './category.entity';
import { ClassValidatorFields } from '../../shared/domain/validators/class.validator.fields';
import type { Notification } from '../../shared/domain/validators/patterns/validation.pattern';

export class CategoryRules {
  @MaxLength(255, { groups: ['name'] })
  name: string;

  constructor(entity: Category) {
    Object.assign(this, entity);
  }
}

export class CategoryValidator extends ClassValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const newFields = fields?.length ? fields : ['name'];
    return super.validate(notification, new CategoryRules(data), newFields);
  }
}

export class CategoryValidatorFactory {
  static create() {
    return new CategoryValidator();
  }
}
