import { Entity } from '../../../../domain/entity';
import { NotFoundError } from '../../../../domain/errors/not.found.error';
import { UUID } from '../../../../value.objects/uuid.value.object';
import { InMemoryRepository } from '../in.memory.repository';

type StubEntityProps = {
  entity_id?: UUID;
  name: string;
  price: number;
};

class StubEntity extends Entity {
  entity_id: UUID;
  name: string;
  price: number;

  constructor(props: StubEntityProps) {
    super();
    this.entity_id = props.entity_id ?? new UUID();
    this.name = props.name;
    this.price = props.price;
  }

  toJSON() {
    return {
      entity_id: this.entity_id,
      name: this.name,
      price: this.price,
    };
  }
}

class StubInMemoryRepository extends InMemoryRepository<StubEntity, UUID> {
  getEntity(): new (...args: any[]) => StubEntity {
    return StubEntity;
  }
}
describe('InMemoryRepository Unit Tests', () => {
  let repository: StubInMemoryRepository;

  beforeEach(() => {
    repository = new StubInMemoryRepository();
  });

  test('should insert an entity', async () => {
    const entity = new StubEntity({
      name: 'Test Entity',
      price: 100,
    });

    await repository.insert(entity);

    expect(repository.items.length).toEqual(1);
    expect(repository.items[0]).toEqual(entity);
  });

  test('should bulk insert entities', async () => {
    const entity1 = new StubEntity({
      name: 'Test Entity 1',
      price: 100,
    });
    const entity2 = new StubEntity({
      name: 'Test Entity 2',
      price: 200,
    });

    await repository.bulkInsert([entity1, entity2]);

    expect(repository.items.length).toEqual(2);
    expect(repository.items[0]).toEqual(entity1);
    expect(repository.items[1]).toEqual(entity2);
  });

  test('should update an entity', async () => {
    const entity = new StubEntity({
      name: 'Test Entity',
      price: 100,
    });

    await repository.insert(entity);

    const updatedEntity = new StubEntity({
      entity_id: entity.entity_id,
      name: 'Updated Entity',
      price: 150,
    });

    await repository.update(updatedEntity);

    expect(repository.items[0]).toEqual(updatedEntity);
  });

  test('should delete an entity', async () => {
    const entity = new StubEntity({
      name: 'Test Entity',
      price: 100,
    });

    await repository.insert(entity);

    await repository.delete(entity.entity_id);

    expect(repository.items.length).toEqual(0);
  });

  test('should find an entity by id', async () => {
    const entity = new StubEntity({
      name: 'Test Entity',
      price: 100,
    });

    await repository.insert(entity);

    const foundEntity = await repository.findById(entity.entity_id);

    expect(foundEntity).toEqual(entity);
  });

  test('should find all entities', async () => {
    const entity1 = new StubEntity({
      name: 'Test Entity 1',
      price: 100,
    });
    const entity2 = new StubEntity({
      name: 'Test Entity 2',
      price: 200,
    });

    await repository.bulkInsert([entity1, entity2]);

    const foundEntities = await repository.findAll();

    expect(foundEntities.length).toEqual(2);
    expect(foundEntities[0]).toEqual(entity1);
    expect(foundEntities[1]).toEqual(entity2);
  });

  test('should throw NotFoundError when updating a non-existing entity', async () => {
    const entity = new StubEntity({
      name: 'Test Entity',
      price: 100,
    });

    await expect(repository.update(entity)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity),
    );
  });

  test('should throw NotFoundError when deleting a non-existing entity', async () => {
    const entity = new StubEntity({
      name: 'Test Entity',
      price: 100,
    });

    await expect(repository.delete(entity.entity_id)).rejects.toThrow(
      new NotFoundError(entity.entity_id, StubEntity),
    );
  });

  test('should return null when finding a non-existing entity', async () => {
    const entity = new StubEntity({
      name: 'Test Entity',
      price: 100,
    });

    const foundEntity = await repository.findById(entity.entity_id);

    expect(foundEntity).toBeNull();
  });

  test('should return an empty array when no entities are found', async () => {
    const foundEntities = await repository.findAll();

    expect(foundEntities.length).toEqual(0);
  });
});
