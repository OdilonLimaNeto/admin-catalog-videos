import { Category } from "../category.entity";

describe("Category Entity Unit Tests", () => {
  describe("Constructor", () => {
    test("should create a category with default values", () => {
      let category = new Category({
        name: "Paradigma Funcional",
      });
      expect(category.id).toBeDefined();
      expect(category.name).toBe("Paradigma Funcional");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with all properties", () => {
      const created_at = new Date();
      let category = new Category({
        id: "123",
        name: "Paradigma Funcional",
        description: "Description",
        is_active: false,
        created_at,
      });
      expect(category.id).toBe("123");
      expect(category.name).toBe("Paradigma Funcional");
      expect(category.description).toBe("Description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toBe(created_at);
    });
  });

  describe("Create Command", () => {
    test("should create a category", () => {
      let category = Category.create({
        name: "Paradigma Funcional",
      });
      expect(category.id).toBeDefined();
      expect(category.name).toBe("Paradigma Funcional");
      expect(category.description).toBeNull();
      expect(category.is_active).toBeTruthy();
      expect(category.created_at).toBeInstanceOf(Date);
    });

    test("should create a category with description deactivated", () => {
      const created_at = new Date();
      let category = Category.create({
        name: "Paradigma Funcional",
        description: "Description",
        is_active: false,
      });
      expect(category.id).toBeDefined();
      expect(category.name).toBe("Paradigma Funcional");
      expect(category.description).toBe("Description");
      expect(category.is_active).toBeFalsy();
      expect(category.created_at).toStrictEqual(created_at);
    });
  });

  describe("Change Category", () => {
    test("should change name", () => {
      let category = new Category({
        name: "Paradigma Funcional",
      });

      category.changeName("Paradigma Funcional Atualizado");
      expect(category.name).toBe("Paradigma Funcional Atualizado");
    });

    test("should change description", () => {
      let category = new Category({
        name: "Paradigma Funcional",
      });
      category.changeDescription("Paradigma Funcional Atualizado");
      expect(category.description).toBe("Paradigma Funcional Atualizado");
    });
  });
});
