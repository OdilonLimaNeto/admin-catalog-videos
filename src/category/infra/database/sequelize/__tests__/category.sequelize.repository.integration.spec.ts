import { Sequelize } from "sequelize-typescript";
import { CategoryModel } from "../category.model";
import { CategorySequelizeRepository } from "../category.sequelize.repository";
import { Category } from "../../../../domain/category.entity";
import { UUID } from "../../../../../shared/value-objects/uuid.value-object";
import { NotFoundError } from "../../../../../shared/domain/errors/not-found.error";

describe("CategorySequelizeRepository Integration Tests", () => {
  let sequelize: Sequelize;
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      models: [CategoryModel],
    });

    await sequelize.sync({ force: true });
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  test("should insert a new category", async () => {
    let category = Category.create({
      name: "Category 1",
    });

    await repository.insert(category);

    let entity = await repository.findById(category.id);
    expect(entity.toJSON()).toStrictEqual(category.toJSON());
  });

  test("should finds a entity by id", async () => {
    let entityFound = await repository.findById(new UUID());
    expect(entityFound).toBeNull();

    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    entityFound = await repository.findById(category.id);
    expect(category.toJSON()).toStrictEqual(entityFound!.toJSON());
  });

  test("should return all categories ", async () => {
    const category1 = Category.fake().aCategory().build();
    const category2 = Category.fake().aCategory().build();
    const category3 = Category.fake().aCategory().build();

    await repository.bulkInsert([category1, category2, category3]);
    const categories = await repository.findAll();
    expect(categories).toHaveLength(3);
    expect(categories[0].toJSON()).toStrictEqual(category1.toJSON());
    expect(categories[1].toJSON()).toStrictEqual(category2.toJSON());
    expect(categories[2].toJSON()).toStrictEqual(category3.toJSON());
  });

  test("should update a entity", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    category.changeName("Updated Category");
    category.changeDescription("Updated Description");

    await repository.update(category);

    const entityFound = await repository.findById(category.id);
    expect(entityFound.toJSON()).toStrictEqual(category.toJSON());
    expect(entityFound.name).toBe("Updated Category");
    expect(entityFound.description).toBe("Updated Description");
  });

  test("should throw error on update when a entity not found", async () => {
    const category = Category.fake().aCategory().build();
    await expect(() => repository.update(category)).rejects.toThrow(
      new NotFoundError(category.id, Category)
    );
  });

  test("should delete a entity", async () => {
    const category = Category.fake().aCategory().build();
    await repository.insert(category);

    await repository.delete(category.id);

    const entityFound = await repository.findById(category.id);
    expect(entityFound).toBeNull();
  });

  test("should throw error on delete when a entity not found", async () => {
    const categoryID = new UUID();
    await expect(() => repository.delete(categoryID)).rejects.toThrow(
      new NotFoundError(categoryID, Category)
    );
  });
});
