import { last } from "lodash";
import { CategorySearchResult } from "../../../../domain/category.repository";
import { CategoryInMemoryRepository } from "../../../../infra/database/in-memory/category-in-memory.repository";
import { ListCategoryUseCase } from "../../list.category.use-case";
import { Category } from "../../../../domain/category.entity";
import { CategoryOutputMapper } from "../../common/category.output";

describe("ListCategoryUseCase Unit Tests", () => {
  let useCase: ListCategoryUseCase;
  let repository: CategoryInMemoryRepository;

  beforeEach(() => {
    repository = new CategoryInMemoryRepository();
    useCase = new ListCategoryUseCase(repository);
  });

  test("toOutput method", () => {
    let result = new CategorySearchResult({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
    });

    let output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [],
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });

    const category = Category.create({ name: "test" });

    result = new CategorySearchResult({
      items: [category],
      total: 1,
      current_page: 1,
      per_page: 2,
    });
    output = useCase["toOutput"](result);
    expect(output).toStrictEqual({
      items: [category].map(CategoryOutputMapper.toOutput),
      total: 1,
      current_page: 1,
      per_page: 2,
      last_page: 1,
    });
  });

  test("should return output sorted by create_at when input param is empty", async () => {
    const categories = [
      new Category({ name: "test 1" }),
      new Category({
        name: "test 1",
        created_at: new Date(new Date().getTime() + 100),
      }),
    ];

    await repository.bulkInsert(categories);

    const output = await useCase.execute({});

    expect(output).toStrictEqual({
      items: [...categories].reverse().map(CategoryOutputMapper.toOutput),
      total: 2,
      current_page: 1,
      per_page: 15,
      last_page: 1,
    });
  });

  test("should returns output using pagination, sort and filter", async () => {
    const categories = [
      new Category({ name: "a" }),
      new Category({ name: "AAA" }),
      new Category({ name: "AaA" }),
      new Category({ name: "b" }),
      new Category({ name: "c" }),
    ];
    await repository.bulkInsert(categories);

    let output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toEqual({
      items: [categories[1], categories[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 2,
      per_page: 2,
      sort: "name",
      filter: "a",
    });
    expect(output).toEqual({
      items: [categories[0]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 2,
      per_page: 2,
      last_page: 2,
    });

    output = await useCase.execute({
      page: 1,
      per_page: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "a",
    });
    expect(output).toEqual({
      items: [categories[0], categories[2]].map(CategoryOutputMapper.toOutput),
      total: 3,
      current_page: 1,
      per_page: 2,
      last_page: 2,
    });
  });
});
