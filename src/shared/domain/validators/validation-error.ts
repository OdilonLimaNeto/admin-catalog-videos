import type { FieldErrors } from "./interface/validator-fields.interface";

export class EntityValidationError extends Error {
  constructor(public errors: FieldErrors, message = "Validation error") {
    super(message);
  }

  count() {
    return Object.keys(this.errors).length;
  }
}
