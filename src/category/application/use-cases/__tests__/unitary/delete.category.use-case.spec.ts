import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { UUID } from "../../../../../shared/value-objects/uuid.value-object";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/database/in-memory/category-in-memory.repository";
import { DeleteCategoryUseCase } from "../../delete.category.use-case";

describe("DeleteCategoryUseCase Unit Tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new DeleteCategoryUseCase(repository);
  });

  test("should throws error when entity not found", async () => {
    const categoryId = new UUID();
    await expect(() => useCase.execute({ id: categoryId.id })).rejects.toThrow(
      new NotFoundError(categoryId.id, Category)
    );
  });

  test("should delete a category", async () => {
    const items = [new Category({ name: "test" })];
    repository.items = items;
    await useCase.execute({ id: items[0].id.id });
    expect(repository.items).toHaveLength(0);
  });
});
