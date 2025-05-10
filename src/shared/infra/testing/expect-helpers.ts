import type { ClassValidatorFields } from "../../domain/validators/class-validator-fields";
import type { FieldErrors } from "../../domain/validators/interface/validator-fields.interface";
import type { EntityValidationError } from "../../domain/validators/validation-error";

type Expected =
  | {
      validator: ClassValidatorFields<any>;
      data: any;
    }
  | (() => any);

expect.extend({
  containsErrorMessages(expected: Expected, received: FieldErrors) {
    if (typeof expected === "function") {
      try {
        expected();
        return isValid();
      } catch (err) {
        const validationError = err as EntityValidationError;
        return assertContainsErrorMessages(validationError.errors, received);
      }
    } else {
      const { validator, data } = expected;
      const validated = validator.validate(data);

      if (validated) {
        return isValid();
      }
      return assertContainsErrorMessages(validator.errors, received);
    }
  },
});

function assertContainsErrorMessages(
  expected: FieldErrors,
  received: FieldErrors
) {
  const isMath = expect.objectContaining(received).asymmetricMatch(expected);

  return isMath
    ? isValid()
    : {
        pass: false,
        message: () =>
          `The validation errors not contains ${JSON.stringify(
            received
          )}. Current: ${JSON.stringify(expected)}`,
      };
}

function isValid() {
  return { pass: true, message: () => "" };
}
