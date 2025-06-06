import type { Category } from '../../../domain/category.entity';

export type CategoryOutput = {
  id: string;
  name: string;
  description?: string | null;
  is_active: boolean;
  created_at: Date;
};

export class CategoryOutputMapper {
  static toOutput(category: Category): CategoryOutput {
    const { ...others } = category.toJSON();
    return { id: category.id.id, ...others };
  }
}
