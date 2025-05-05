import { InvalidUUIDError, UUID } from "./uuid.value-object";
import { validate as uuidValidate } from "uuid";

describe("UUID Unit Tests", () => {
  const validateSpy = jest.spyOn(UUID.prototype as any, "validate");
  test("should throw error when UUID is invalid", () => {
    const invalidUUID = "invalid-uuid";
    expect(() => {
      new UUID(invalidUUID);
    }).toThrow(InvalidUUIDError);
    expect(validateSpy).toHaveBeenCalled();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should create a valid uuid", () => {
    const uuid = new UUID();
    expect(uuid.id).toBeDefined();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });

  test("should accept a valid uuid", () => {
    const validUUID = "123e4567-e89b-12d3-a456-426614174000";
    const uuid = new UUID(validUUID);
    expect(uuid.id).toBe(validUUID);
    expect(uuidValidate(uuid.id)).toBeTruthy();
    expect(validateSpy).toHaveBeenCalledTimes(1);
  });
});
