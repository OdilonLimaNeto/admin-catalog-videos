import { Entity } from "../../shared/domain/entity";
import type { ValueObject } from "../../shared/domain/value-object";
import { UUID } from "../../shared/value-objects/uuid.value-object";
import { CategoryFakeBuilder } from "./category-fake.builder";
import { CategoryValidatorFactory } from "./category.validator";

export type CategoryProps = {
  id?: UUID;
  name: string;
  description?: string | null;
  is_active?: boolean;
  created_at?: Date;
};

export type CategoryCreateCommand = {
  name: string;
  description?: string | null;
  is_active?: boolean;
};

export class Category extends Entity {
  id: UUID;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;

  constructor(props: CategoryProps) {
    super();
    this.id = props.id || new UUID();
    this.name = props.name;
    this.description = props.description || null;
    this.is_active = props.is_active === undefined ? true : props.is_active;
    this.created_at = props.created_at || new Date();
  }

  static create(props: CategoryCreateCommand): Category {
    const category = new Category(props);
    category.validate(["name"]);
    return category;
  }

  validate(fields?: string[]) {
    const validator = CategoryValidatorFactory.create();
    return validator.validate(this.notification, this, fields);
  }

  static fake() {
    return CategoryFakeBuilder;
  }

  changeName(name: string): void {
    this.name = name;
    this.validate(["name"]);
  }

  changeDescription(description: string): void {
    this.description = description;
  }

  activate(): void {
    this.is_active = true;
  }

  deactivate(): void {
    this.is_active = false;
  }

  toJSON() {
    return {
      id: this.id.id,
      name: this.name,
      description: this.description,
      is_active: this.is_active,
      created_at: this.created_at,
    };
  }

  get entity_id(): ValueObject {
    return this.id;
  }
}
