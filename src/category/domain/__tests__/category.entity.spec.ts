import { UUID } from "../../../shared/value-objects/uuid.value-object";
import { Category } from "../category.entity";

describe("Category Entity Unit Tests", () => {
  let validateSpy: jest.SpyInstance;
  beforeEach(() => {
    validateSpy = jest.spyOn(Category, "validate");
  });
  describe("Constructor", () => {
    test("should create a category with default values", () => {
      let category = Category.create({
        name: "Paradigma Funcional",
      });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe("Paradigma Funcional");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category with all properties", () => {
      let category = Category.create({
        name: "Paradigma Funcional",
        description: "Description",
        is_active: false,
      });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe("Paradigma Funcional");
      expect(category.description).toBe("Description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("Create Command", () => {
    test("should create a category", () => {
      let category = Category.create({
        name: "Paradigma Funcional",
      });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe("Paradigma Funcional");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });

    test("should create a category with description deactivated", () => {
      let category = Category.create({
        name: "Paradigma Funcional",
        description: "Description",
        is_active: false,
      });
      expect(category.id).toBeInstanceOf(UUID);
      expect(category.name).toBe("Paradigma Funcional");
      expect(category.description).toBe("Description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBeInstanceOf(Date);
      expect(validateSpy).toHaveBeenCalledTimes(1);
    });
  });

  describe("id field", () => {
    const arrange = [{ id: null }, { id: undefined }, { id: new UUID() }];

    test.each(arrange)("id = %j", ({ id }) => {
      const category = new Category({
        name: "Paradigma Funcional",
        id: id as any,
      });
      expect(category.id).toBeInstanceOf(UUID);
      if (id instanceof UUID) {
        expect(category.id).toBe(id);
      }
    });
  });

  describe("Change Category", () => {
    test("should change name", () => {
      let category = Category.create({
        name: "Paradigma Funcional",
      });

      category.changeName("Paradigma Funcional Atualizado");
      expect(category.name).toBe("Paradigma Funcional Atualizado");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });

    test("should change description", () => {
      let category = Category.create({
        name: "Paradigma Funcional",
      });
      category.changeDescription("Paradigma Funcional Atualizado");
      expect(category.description).toBe("Paradigma Funcional Atualizado");
      expect(validateSpy).toHaveBeenCalledTimes(2);
    });
  });
});

describe("Category Entity Unit Tests - Validation", () => {
  describe("Category Validator", () => {
    describe("Create Command", () => {
      it("should an invalid category with name property", () => {
        expect(() => Category.create({ name: null })).containsErrorMessages({
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });

        expect(() => Category.create({ name: "" })).containsErrorMessages({
          name: ["name should not be empty"],
        });

        expect(() => Category.create({ name: 5 as any })).containsErrorMessages(
          {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          }
        );

        expect(() =>
          Category.create({ name: "a".repeat(256) })
        ).containsErrorMessages({
          name: ["name must be shorter than or equal to 255 characters"],
        });
      });

      it("should an invalid category with description property", () => {
        expect(() =>
          Category.create({
            name: "Paradigma Funcional",
            description: 5 as any,
          })
        ).containsErrorMessages({
          description: ["description must be a string"],
        });
      });
      it("should an invalid category using is_active property", () => {
        expect(() =>
          Category.create({ name: "Paradigma Funcional", is_active: 5 as any })
        ).containsErrorMessages({
          is_active: ["is_active must be a boolean value"],
        });
      });
    });

    describe("Change Name Command", () => {
      it("should an invalid category with name property", () => {
        const category = Category.create({
          name: "Paradigma Funcional",
        });

        expect(() => category.changeName(null)).containsErrorMessages({
          name: [
            "name should not be empty",
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });

        expect(() => category.changeName("")).containsErrorMessages({
          name: ["name should not be empty"],
        });

        expect(() => category.changeName(5 as any)).containsErrorMessages({
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });

        expect(() => category.changeName(5 as any)).containsErrorMessages({
          name: [
            "name must be a string",
            "name must be shorter than or equal to 255 characters",
          ],
        });
      });
    });

    describe("Change Description Command", () => {
      it("should an invalid category using description property", () => {
        const category = Category.create({
          name: "Paradigma Funcional",
        });

        expect(() =>
          category.changeDescription(5 as any)
        ).containsErrorMessages({
          description: ["description must be a string"],
        });
      });
    });
  });
});
