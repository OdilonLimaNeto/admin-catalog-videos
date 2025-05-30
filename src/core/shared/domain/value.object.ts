import isEqual from 'lodash/isEqual';
export class ValueObject {
  public equals(valueObject: this) {
    if (valueObject === null || valueObject === undefined) {
      return false;
    }

    if (valueObject.constructor.name !== this.constructor.name) {
      return false;
    }

    return isEqual(valueObject, this);
  }
}
