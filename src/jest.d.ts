import type { FieldErrors } from "./shared/domain/validators/interface/validator-fields.interface";

declare global {
  namespace jest {
    interface Matchers<R> {
      notificationContainsErrorMessages: (
        expected: Array<string | { [key: string]: string[] }>
      ) => R;
      toBeValueObject: (expected: ValueObject) => R;
    }
  }
}
