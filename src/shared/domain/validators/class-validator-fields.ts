import type { IValidatorFields } from "./interface/validator-fields.interface";
import { validateSync } from "class-validator";

export abstract class ClassValidatorFields<PropsValidated>
  implements IValidatorFields<PropsValidated>
{
  errors: Record<string, string[]> | null = null;
  validateDate: PropsValidated | null = null;

  validate(data: any): boolean {
    const errors = validateSync(data);
    if (errors.length) {
      this.errors = {};
      for (const error of errors) {
        const field = error.property;
        this.errors[field] = Object.values(error.constraints!);
      }
    } else {
      this.validateDate = data;
    }
    return !errors.length;
  }
}
