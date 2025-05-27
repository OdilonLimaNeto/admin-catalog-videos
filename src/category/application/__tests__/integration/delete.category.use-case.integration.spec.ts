import { NotFoundError } from "../../../../shared/domain/errors/not-found.error";
import { setupSequelize } from "../../../../shared/infra/testing/helpers";
import { UUID } from "../../../../shared/value-objects/uuid.value-object";
import { Category } from "../../../domain/category.entity";
import { CategoryModel } from "../../../infra/database/sequelize/category.model";
import { CategorySequelizeRepository } from "../../../infra/database/sequelize/category.sequelize.repository";
import { DeleteCategoryUseCase } from "../../delete.category.use-case";

describe("DeleteCategoryUseCase Integration Tests", () => {
  let useCase: DeleteCategoryUseCase;
  let repository: CategorySequelizeRepository;

  setupSequelize({ models: [CategoryModel] });

  beforeEach(() => {
    repository = new CategorySequelizeRepository(CategoryModel);
    useCase = new DeleteCategoryUseCase(repository);
  });

  test("should throws error when entity not found", async () => {
    const uuid = new UUID();
    await expect(() => useCase.execute(uuid)).rejects.toThrow(
      new NotFoundError(uuid, Category)
    );
  });

  test("should delete a category", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    await useCase.execute({ id: category.id.id });
    await expect(
      repository.findById(new UUID(category.id.id))
    ).resolves.toBeNull();
  });
});
