import { EntityValidationError } from "../../../../../shared/domain/validators/validation-error";
import { setupSequelize } from "../../../../../shared/infra/testing/helpers";
import { UUID } from "../../../../../shared/value-objects/uuid.value-object";
import { CategoryModel } from "../../../../infra/database/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../../infra/database/sequelize/category.sequelize.repository";
import { CreateCategoryUseCase } from "../../create.category.use-case";

describe("CreateCategoryUseCase Integration Tests", () => {
  let useCase: CreateCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new CreateCategoryUseCase(repository);
  });

  test("should throw an error when category is not valid", async () => {
    const input = { name: "t".repeat(256) };
    await expect(() => useCase.execute(input)).rejects.toThrow(
      new EntityValidationError([
        { name: ["Name must be between 3 and 255 characters"] },
      ])
    );
  });

  test("should create a category", async () => {
    let output = await useCase.execute({ name: "Category 1" });
    let entity = await repository.findById(new UUID(output.id));
    expect(output).toStrictEqual({
      id: entity.id.id,
      name: "Category 1",
      description: null,
      is_active: true,
      created_at: entity.created_at,
    });

    output = await useCase.execute({
      name: "Category 2",
      description: "Some description",
      is_active: false,
    });
    entity = await repository.findById(new UUID(output.id));
    expect(output).toStrictEqual({
      id: entity.id.id,
      name: "Category 2",
      description: "Some description",
      is_active: false,
      created_at: entity.created_at,
    });

    output = await useCase.execute({
      name: "Category 3",
      description: "Some description",
      is_active: true,
    });
    entity = await repository.findById(new UUID(output.id));
    expect(output).toStrictEqual({
      id: entity.id.id,
      name: "Category 3",
      description: "Some description",
      is_active: true,
      created_at: entity.created_at,
    });
  });
});
