import { validateSync } from 'class-validator';
import type { IValidatorFields } from './interface/validator.fields.interface';
import type { Notification } from './patterns/validation.pattern';

export abstract class ClassValidatorFields implements IValidatorFields {
  validate(notification: Notification, data: any, fields?: string[]): boolean {
    const errors = validateSync(data, {
      groups: fields,
    });
    if (errors.length > 0) {
      for (const error of errors) {
        const field = error.property;
        Object.values(error.constraints!).forEach((message: string) => {
          notification.addError(message, field);
        });
      }
    }
    return !errors.length;
  }
}
