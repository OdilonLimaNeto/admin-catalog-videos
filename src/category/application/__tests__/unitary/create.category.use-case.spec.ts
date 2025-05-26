import { CategoryInMemoryRepository } from "../../../infra/database/in-memory/category-in-memory.repository";
import { CreateCategoryUseCase } from "../../create.category.use-case";

describe("CreateCategoryUseCase Unit Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new CreateCategoryUseCase(repository);
  });

  test("should create a category", async () => {
    const spyInsert = jest.spyOn(repository, "insert");
    let output = await useCase.execute({ name: "Category 1" });
    expect(spyInsert).toHaveBeenCalledTimes(1);
    expect(output).toStrictEqual({
      id: repository.items[0].id.id,
      name: "Category 1",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });

    output = await useCase.execute({
      name: "Category 2",
      description: "Some description",
      is_active: false,
    });

    expect(spyInsert).toHaveBeenCalledTimes(2);
    expect(output).toStrictEqual({
      id: repository.items[1].id.id,
      name: "Category 2",
      description: "Some description",
      is_active: false,
      created_at: repository.items[1].created_at,
    });
  });
});
