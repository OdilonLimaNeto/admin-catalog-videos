import { Chance } from 'chance';
import { CategoryFakeBuilder } from './category.fake.builder';
import { UUID } from '../../shared/value.objects/uuid.value.object';

describe('CategoryFakerBuilder Unit Tests', () => {
  describe('id prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    test('should throw error when any with methods has called', () => {
      expect(() => faker.id).toThrowError(
        new Error("Property id not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_id']).toBeUndefined();
    });

    test('withCategoryId', () => {
      const id = new UUID();
      const $this = faker.withUUID(id);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_id']).toBe(id);

      faker.withUUID(() => id);
      //@ts-expect-error _id is a callable
      expect(faker['_id']()).toBe(id);

      expect(faker.id).toBe(id);
    });

    test('should pass index to id factory', () => {
      let mockFactory = jest.fn(() => new UUID());
      faker.withUUID(mockFactory);
      faker.build();
      expect(mockFactory).toHaveBeenCalledTimes(1);

      const id = new UUID();
      mockFactory = jest.fn(() => id);
      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withUUID(mockFactory);
      fakerMany.build();

      expect(mockFactory).toHaveBeenCalledTimes(2);
      expect(fakerMany.build()[0].id).toBe(id);
      expect(fakerMany.build()[1].id).toBe(id);
    });
  });

  describe('name prop', () => {
    const faker = CategoryFakeBuilder.aCategory();
    test('should be a function', () => {
      expect(typeof faker['_name']).toBe('function');
    });

    test('should call the word method', () => {
      const chance = Chance();
      const spyWordMethod = jest.spyOn(chance, 'word');
      faker['chance'] = chance;
      faker.build();

      expect(spyWordMethod).toHaveBeenCalled();
    });

    test('withName', () => {
      const $this = faker.withName('test name');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_name']).toBe('test name');

      faker.withName(() => 'test name');
      //@ts-expect-error name is callable
      expect(faker['_name']()).toBe('test name');

      expect(faker.name).toBe('test name');
    });

    test('should pass index to name factory', () => {
      faker.withName((index) => `test name ${index}`);
      const category = faker.build();
      expect(category.name).toBe(`test name 0`);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withName((index) => `test name ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].name).toBe(`test name 0`);
      expect(categories[1].name).toBe(`test name 1`);
    });

    test('invalid too long case', () => {
      const $this = faker.withInvalidNameTooLong();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_name'].length).toBe(256);

      const tooLong = 'a'.repeat(256);
      faker.withInvalidNameTooLong(tooLong);
      expect(faker['_name'].length).toBe(256);
      expect(faker['_name']).toBe(tooLong);
    });
  });

  describe('description prop', () => {
    const faker = CategoryFakeBuilder.aCategory();
    test('should be a function', () => {
      expect(typeof faker['_description']).toBe('function');
    });

    test('should call the paragraph method', () => {
      const chance = Chance();
      const spyParagraphMethod = jest.spyOn(chance, 'paragraph');
      faker['chance'] = chance;
      faker.build();
      expect(spyParagraphMethod).toHaveBeenCalled();
    });

    test('withDescription', () => {
      const $this = faker.withDescription('test description');
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_description']).toBe('test description');

      faker.withDescription(() => 'test description');
      //@ts-expect-error description is callable
      expect(faker['_description']()).toBe('test description');

      expect(faker.description).toBe('test description');
    });

    test('should pass index to description factory', () => {
      faker.withDescription((index) => `test description ${index}`);
      const category = faker.build();
      expect(category.description).toBe(`test description 0`);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withDescription((index) => `test description ${index}`);
      const categories = fakerMany.build();

      expect(categories[0].description).toBe(`test description 0`);
      expect(categories[1].description).toBe(`test description 1`);
    });
  });

  describe('is_active prop', () => {
    const faker = CategoryFakeBuilder.aCategory();
    test('should be a function', () => {
      expect(typeof faker['_is_active']).toBe('function');
    });

    test('activate', () => {
      const $this = faker.activate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_is_active']).toBe(true);
      expect(faker.is_active).toBe(true);
    });

    test('deactivate', () => {
      const $this = faker.deactivate();
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_is_active']).toBe(false);
      expect(faker.is_active).toBe(false);
    });
  });

  describe('created_at prop', () => {
    const faker = CategoryFakeBuilder.aCategory();

    test('should throw error when any with methods has called', () => {
      const fakerCategory = CategoryFakeBuilder.aCategory();
      expect(() => fakerCategory.created_at).toThrow(
        new Error("Property created_at not have a factory, use 'with' methods"),
      );
    });

    test('should be undefined', () => {
      expect(faker['_created_at']).toBeUndefined();
    });

    test('withCreatedAt', () => {
      const date = new Date();
      const $this = faker.withCreatedAt(date);
      expect($this).toBeInstanceOf(CategoryFakeBuilder);
      expect(faker['_created_at']).toBe(date);

      faker.withCreatedAt(() => date);
      //@ts-expect-error _created_at is a callable
      expect(faker['_created_at']()).toBe(date);
      expect(faker.created_at).toBe(date);
    });

    test('should pass index to created_at factory', () => {
      const date = new Date();
      faker.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const category = faker.build();
      expect(category.created_at.getTime()).toBe(date.getTime() + 2);

      const fakerMany = CategoryFakeBuilder.theCategories(2);
      fakerMany.withCreatedAt((index) => new Date(date.getTime() + index + 2));
      const categories = fakerMany.build();

      expect(categories[0].created_at.getTime()).toBe(date.getTime() + 2);
      expect(categories[1].created_at.getTime()).toBe(date.getTime() + 3);
    });
  });

  test('should create a category', () => {
    const faker = CategoryFakeBuilder.aCategory();
    let category = faker.build();

    expect(category.id).toBeInstanceOf(UUID);
    expect(typeof category.name === 'string').toBeTruthy();
    expect(typeof category.description === 'string').toBeTruthy();
    expect(category.is_active).toBe(true);
    expect(category.created_at).toBeInstanceOf(Date);

    const created_at = new Date();
    const id = new UUID();
    category = faker
      .withUUID(id)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    expect(category.id.id).toBe(id.id);
    expect(category.name).toBe('name test');
    expect(category.description).toBe('description test');
    expect(category.is_active).toBe(false);
    expect(category.created_at).toBe(created_at);
  });

  test('should create many categories', () => {
    const faker = CategoryFakeBuilder.theCategories(2);
    let categories = faker.build();

    categories.forEach((category) => {
      expect(category.id).toBeInstanceOf(UUID);
      expect(typeof category.name === 'string').toBeTruthy();
      expect(typeof category.description === 'string').toBeTruthy();
      expect(category.is_active).toBe(true);
      expect(category.created_at).toBeInstanceOf(Date);
    });

    const created_at = new Date();
    const id = new UUID();
    categories = faker
      .withUUID(id)
      .withName('name test')
      .withDescription('description test')
      .deactivate()
      .withCreatedAt(created_at)
      .build();

    categories.forEach((category) => {
      expect(category.id.id).toBe(id.id);
      expect(category.name).toBe('name test');
      expect(category.description).toBe('description test');
      expect(category.is_active).toBe(false);
      expect(category.created_at).toBe(created_at);
    });
  });
});
