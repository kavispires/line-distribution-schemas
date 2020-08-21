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
   * Get instance id
   */
  get id() {
    return this._id;
  }

  /**
   * Generate object with id and reference to this library entry
   */
  get entry() {
    return {
      [this._id]: this,
    };
  }

  /**
   * Placeholder to return the data object
   * @returns {object}
   */
  get data() {
    return {};
  }

  /**
   * Placeholder to return the relationships object
   * @returns {object}
   */
  get relationships() {
    return {};
  }

  /**
   * Returns a Json:API formatted entry
   * @returns {object}
   */
  get jsonApi() {
    return {
      id: this._id,
      type: this._type,
      attributes: this.data,
      relationships: this.relationships,
    };
  }

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
    if (!this._id) throw Error(`Failed to validate ${capitalize(this._type)} ID`);
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
      throw Error(`${capitalize(this._type)} validation has failed: ${err.message}`);
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

/**
 * Capitalizes the first letter of a string
 * @param {string} str
 * @returns {string}
 */
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
