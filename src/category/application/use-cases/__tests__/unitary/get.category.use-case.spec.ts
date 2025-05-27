import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";
import { UUID } from "../../../../../shared/value-objects/uuid.value-object";
import { Category } from "../../../../domain/category.entity";
import { CategoryInMemoryRepository } from "../../../../infra/database/in-memory/category-in-memory.repository";
import { GetCategoryUseCase } from "../../get.category.use-case";

describe("GetCategoryUseCase Unit Tests", () => {
  let useCase: GetCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new GetCategoryUseCase(repository);
  });

  test("should throws error when entity not found", async () => {
    const uuid = new UUID();
    await expect(() => useCase.execute({ id: uuid.id })).rejects.toThrow(
      new NotFoundError(uuid.id, Category)
    );
  });

  test("should returns a category", async () => {
    const spyFindById = jest.spyOn(repository, "findById");
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    const output = await useCase.execute({ id: category.id.id });

    expect(spyFindById).toHaveBeenCalledWith(category.id);
    expect(spyFindById).toHaveBeenCalledTimes(1);
    expect(output).toEqual({
      id: category.id.id,
      name: category.name,
      description: category.description,
      is_active: category.is_active,
      created_at: category.created_at,
    });
  });
});
