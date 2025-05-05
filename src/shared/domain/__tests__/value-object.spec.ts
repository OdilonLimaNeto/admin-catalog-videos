import { ValueObject } from "../value-object";

class StringValueObject extends ValueObject {
  constructor(readonly value: string) {
    super();
  }
}

class ComplexValueObject extends ValueObject {
  constructor(readonly value1: string, readonly value2: number) {
    super();
  }
}

describe("ValueObject Unit Tests", () => {
  test("should be equals", () => {
    const ValueObject1 = new StringValueObject("value");
    const ValueObject2 = new StringValueObject("value");
    expect(ValueObject1.equals(ValueObject2)).toBeTruthy();

    const ComplexValueObject1 = new ComplexValueObject("value", 1);
    const ComplexValueObject2 = new ComplexValueObject("value", 1);

    expect(ComplexValueObject1.equals(ComplexValueObject2)).toBeTruthy();
  });

  test("should not be equals", () => {
    const ValueObject1 = new StringValueObject("value");
    const ValueObject2 = new StringValueObject("other_value");
    expect(ValueObject1.equals(ValueObject2)).toBeFalsy();

    const ComplexValueObject1 = new ComplexValueObject("value", 1);
    const ComplexValueObject2 = new ComplexValueObject("other_value", 1);

    expect(ComplexValueObject1.equals(ComplexValueObject2)).toBeFalsy();
  });
});
