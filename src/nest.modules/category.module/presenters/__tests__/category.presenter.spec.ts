import { instanceToPlain } from 'class-transformer';
import {
  CategoryPresenter,
  CategoryCollectionPresenter,
} from '../category.presenter';
import type { CategoryOutput } from '@core/category/application/use.cases/common/category.output';
import type { ListCategoryOutput } from '@core/category/application/use.cases/list.category/list.category.use.case';

describe('CategoryPresenter Unit Tests', () => {
  describe('Constructor', () => {
    it('should set values correctly', () => {
      const created_at = new Date();
      const output: CategoryOutput = {
        id: '1',
        name: 'Test Category',
        description: 'Test description',
        is_active: true,
        created_at,
      };

      const presenter = new CategoryPresenter(output);

      expect(presenter.id).toBe('1');
      expect(presenter.name).toBe('Test Category');
      expect(presenter.description).toBe('Test description');
      expect(presenter.is_active).toBe(true);
      expect(presenter.created_at).toBe(created_at);
    });

    it('should set values with null description', () => {
      const created_at = new Date();
      const output: CategoryOutput = {
        id: '2',
        name: 'Test Category 2',
        description: null,
        is_active: false,
        created_at,
      };

      const presenter = new CategoryPresenter(output);

      expect(presenter.id).toBe('2');
      expect(presenter.name).toBe('Test Category 2');
      expect(presenter.description).toBeNull();
      expect(presenter.is_active).toBe(false);
      expect(presenter.created_at).toBe(created_at);
    });

    it('should set values with undefined description', () => {
      const created_at = new Date();
      const output: CategoryOutput = {
        id: '3',
        name: 'Test Category 3',
        description: undefined,
        is_active: true,
        created_at,
      };

      const presenter = new CategoryPresenter(output);

      expect(presenter.id).toBe('3');
      expect(presenter.name).toBe('Test Category 3');
      expect(presenter.description).toBeUndefined();
      expect(presenter.is_active).toBe(true);
      expect(presenter.created_at).toBe(created_at);
    });
  });

  describe('instanceToPlain', () => {
    it('should transform created_at to ISO string', () => {
      const created_at = new Date();
      const output: CategoryOutput = {
        id: '1',
        name: 'Test Category',
        description: 'Test description',
        is_active: true,
        created_at,
      };

      const presenter = new CategoryPresenter(output);
      const plainObject = instanceToPlain(presenter);

      expect(plainObject).toStrictEqual({
        id: '1',
        name: 'Test Category',
        description: 'Test description',
        is_active: true,
        created_at: created_at.toISOString(),
      });
    });

    it('should transform created_at to ISO string with null description', () => {
      const created_at = new Date();
      const output: CategoryOutput = {
        id: '2',
        name: 'Test Category 2',
        description: null,
        is_active: false,
        created_at,
      };

      const presenter = new CategoryPresenter(output);
      const plainObject = instanceToPlain(presenter);

      expect(plainObject).toStrictEqual({
        id: '2',
        name: 'Test Category 2',
        description: null,
        is_active: false,
        created_at: created_at.toISOString(),
      });
    });
  });
});

describe('CategoryCollectionPresenter Unit Tests', () => {
  describe('Constructor', () => {
    it('should set values correctly', () => {
      const created_at = new Date();
      const output: ListCategoryOutput = {
        items: [
          {
            id: '1',
            name: 'Test Category 1',
            description: 'Test description 1',
            is_active: true,
            created_at,
          },
          {
            id: '2',
            name: 'Test Category 2',
            description: null,
            is_active: false,
            created_at,
          },
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      };

      const presenter = new CategoryCollectionPresenter(output);

      expect(presenter.data).toHaveLength(2);
      expect(presenter.data[0]).toBeInstanceOf(CategoryPresenter);
      expect(presenter.data[0].id).toBe('1');
      expect(presenter.data[0].name).toBe('Test Category 1');
      expect(presenter.data[0].description).toBe('Test description 1');
      expect(presenter.data[0].is_active).toBe(true);
      expect(presenter.data[0].created_at).toBe(created_at);

      expect(presenter.data[1]).toBeInstanceOf(CategoryPresenter);
      expect(presenter.data[1].id).toBe('2');
      expect(presenter.data[1].name).toBe('Test Category 2');
      expect(presenter.data[1].description).toBeNull();
      expect(presenter.data[1].is_active).toBe(false);
      expect(presenter.data[1].created_at).toBe(created_at);

      expect(presenter.meta.current_page).toBe(1);
      expect(presenter.meta.per_page).toBe(2);
      expect(presenter.meta.last_page).toBe(3);
      expect(presenter.meta.total).toBe(4);
    });

    it('should set values with empty items array', () => {
      const output: ListCategoryOutput = {
        items: [],
        current_page: 1,
        per_page: 10,
        last_page: 1,
        total: 0,
      };

      const presenter = new CategoryCollectionPresenter(output);

      expect(presenter.data).toHaveLength(0);
      expect(presenter.meta.current_page).toBe(1);
      expect(presenter.meta.per_page).toBe(10);
      expect(presenter.meta.last_page).toBe(1);
      expect(presenter.meta.total).toBe(0);
    });
  });

  describe('instanceToPlain', () => {
    it('should transform collection presenter data', () => {
      const created_at = new Date();
      const output: ListCategoryOutput = {
        items: [
          {
            id: '1',
            name: 'Test Category 1',
            description: 'Test description 1',
            is_active: true,
            created_at,
          },
          {
            id: '2',
            name: 'Test Category 2',
            description: null,
            is_active: false,
            created_at,
          },
        ],
        current_page: 1,
        per_page: 2,
        last_page: 3,
        total: 4,
      };

      const presenter = new CategoryCollectionPresenter(output);
      const plainObject = instanceToPlain(presenter);

      expect(plainObject).toStrictEqual({
        data: [
          {
            id: '1',
            name: 'Test Category 1',
            description: 'Test description 1',
            is_active: true,
            created_at: created_at.toISOString(),
          },
          {
            id: '2',
            name: 'Test Category 2',
            description: null,
            is_active: false,
            created_at: created_at.toISOString(),
          },
        ],
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        },
      });
    });

    it('should transform collection presenter data with string number values', () => {
      const created_at = new Date();
      const output: ListCategoryOutput = {
        items: [
          {
            id: '1',
            name: 'Test Category 1',
            description: 'Test description 1',
            is_active: true,
            created_at,
          },
        ],
        current_page: '1' as any,
        per_page: '2' as any,
        last_page: '3' as any,
        total: '4' as any,
      };

      const presenter = new CategoryCollectionPresenter(output);
      const plainObject = instanceToPlain(presenter);

      expect(plainObject).toStrictEqual({
        data: [
          {
            id: '1',
            name: 'Test Category 1',
            description: 'Test description 1',
            is_active: true,
            created_at: created_at.toISOString(),
          },
        ],
        meta: {
          current_page: 1,
          per_page: 2,
          last_page: 3,
          total: 4,
        },
      });
    });

    it('should transform collection presenter data with empty items', () => {
      const output: ListCategoryOutput = {
        items: [],
        current_page: 1,
        per_page: 10,
        last_page: 1,
        total: 0,
      };

      const presenter = new CategoryCollectionPresenter(output);
      const plainObject = instanceToPlain(presenter);

      expect(plainObject).toStrictEqual({
        data: [],
        meta: {
          current_page: 1,
          per_page: 10,
          last_page: 1,
          total: 0,
        },
      });
    });
  });
});
