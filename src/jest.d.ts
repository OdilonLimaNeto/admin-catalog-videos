import type { FieldErrors } from "./shared/domain/validators/interface/validator-fields.interface";

declare global {
  namespace jest {
    interface Matchers<R> {
      containsErrorMessages: (expected: FieldErrors) => R;
    }
  }
}
