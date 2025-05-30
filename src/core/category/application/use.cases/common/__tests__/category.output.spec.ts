import { Category } from '../../../../domain/category.entity';
import { CategoryOutputMapper } from '../category.output';

describe('CategoryOutput Unit Tests', () => {
  it('should convert a category entity to CategoryOutput', () => {
    const category = Category.create({
      name: 'Test Category',
      description: 'This is a test category',
      is_active: true,
    });

    const spyToJSON = jest.spyOn(category, 'toJSON');
    const output = CategoryOutputMapper.toOutput(category);
    expect(spyToJSON).toHaveBeenCalled();
    expect(output).toStrictEqual({
      id: category.id.id,
      name: 'Test Category',
      description: 'This is a test category',
      is_active: true,
      created_at: category.created_at,
    });
  });
});
