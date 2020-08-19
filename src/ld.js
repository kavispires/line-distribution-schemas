import { typeCheck } from './type-check';
import { Enum } from './enum';

export default class LD {
  constructor(id, type) {
    this._id = id;
    this._type = type;

    if (!this._type) {
      throw Error('You must assign a type');
    }
  }

  // Property types
  types = {};

  /**
   * Flag indicating if data is valid
   * @returns {boolean}
   */
  get isValid() {
    try {
      this.validate();
    } catch (err) {
      return false;
    }
    return true;
  }

  get _capitalizedType() {
    return this._type.charAt(0).toUpperCase() + this._type.slice(1);
  }

  /**
   * Sets instance id
   * @param {string} id
   */
  set id(id) {
    this._id = id;
  }

  /**
   * Validates if instance has an id
   */
  validateID() {
    if (!this._id) throw Error(`Failed to validate ${this._capitalizedType} ID`);
    return true;
  }

  /**
   * Validates if given data has correct type
   */
  validateType({ type }) {
    if (type && type !== this._type) {
      throw Error(`Failed to validate type. Expected '${this._type}', instead got '${type}'`);
    }
    return true;
  }

  /**
   * Validates all properties and its native types
   */
  validate() {
    try {
      typeCheck(this, this.types);
    } catch (err) {
      throw Error(`${this._capitalizedType} validation has failed: ${err.message}`);
    }

    return true;
  }

  /**
   * Returns value only if it is not UNKNOWN nor NA
   * @param {string} value
   * @returns {string|null}
   */
  getKnownEnumValue(value) {
    return value === Enum.unknown || value === Enum.notAvailable ? null : value ?? null;
  }

  /**
   * Returns object only if it has entries
   * @param {object} obj
   * @returns {object|null}
   */
  getKnownObjectValue(obj) {
    return Boolean(Object.keys(obj).length) ? obj : null;
  }
}
