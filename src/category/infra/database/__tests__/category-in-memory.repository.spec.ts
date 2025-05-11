import { Category } from "../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../category-in-memory.repository";

describe("CategoryInMemoryRepository Unit Tests", () => {
  test("should be able to create an instance of CategoryInMemoryRepository", () => {
    const repository = new CategoryInMemoryRepository();
    expect(repository).toBeInstanceOf(CategoryInMemoryRepository);
  });

  test("should be able to add a category", () => {
    const repository = new CategoryInMemoryRepository();
    const category = new Category({ name: "Test Category" });
    repository.insert(category);
    expect(repository.items.length).toBe(1);
    expect(repository.items[0]).toEqual(category);
  });
});
