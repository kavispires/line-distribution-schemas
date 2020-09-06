export default class Collection {
  constructor(collectionName, libraryClass, data) {
    this._collectionName = collectionName;
    this._libraryClass = libraryClass;

    this._records = {};
    this._createdAt = Date.now();
    this._lastUpdatedAt = this._createdAt;

    if (!this._collectionName) {
      throw Error('You must assign a collection name, usually the pluralized library class name');
    }

    if (!this._libraryClass) {
      throw Error('You must assign a library class');
    }

    if (data) {
      this.batchAddRecords(data, true);
    }
  }

  /**
   * Get list of records
   * @returns {array}
   */
  get records() {
    return Object.values(this._records);
  }

  /**
   * Get dictionary of records
   * @returns {object}
   */
  get recordsDict() {
    return this._records;
  }

  /**
   * Determines if collection has been modified since initiation
   * @returns {boolean}
   */
  get isDirty() {
    return this._createdAt !== this._lastUpdatedAt;
  }

  /**
   * Get dictionary of types of the library class
   * @returns {object}
   */
  get types() {
    return new this._libraryClass().types;
  }

  /**
   * Creates multiple records at once
   * @param {object} data
   * @param {boolean} isInitialData
   */
  batchAddRecords(data, isInitialData = false) {
    data.forEach((entry) => {
      const dataEntry =
        entry instanceof this._libraryClass ? entry : new this._libraryClass(entry.id, entry);
      this._records[entry.id] = dataEntry;
    });
    this._lastUpdatedAt = isInitialData ? this._createdAt : Date.now();
    return this.records;
  }

  /**
   * Adds a single record to the collection
   * @param {string} id
   * @param {string} data
   */
  addRecord(id, data) {
    if (data.id && data.id !== id) {
      throw Error('The provided id and the id inside the data object do not match');
    }

    const dataEntry = data instanceof this._libraryClass ? data : new this._libraryClass(id, data);

    this._records[id] = dataEntry;
    this._lastUpdatedAt = Date.now();
    return this._records[id];
  }

  /**
   * Updates a single record to the collection
   * @param {string} id
   * @param {string} data
   */
  updateRecord(id, data) {
    if (data.id && data.id !== id) {
      throw Error('The provided id and the id inside the data object do not match');
    }

    this._records[id].serialize(data);

    this._lastUpdatedAt = Date.now();
    return this._records[id];
  }

  /**
   * Replaces a single record to the collection
   * @param {string} id
   * @param {string} data
   * @returns {object} the record itself
   */
  replaceRecord(id, data) {
    if (data.id && data.id !== id) {
      throw Error('The provided id and the id inside the data object do not match');
    }

    const dataEntry = data instanceof this._libraryClass ? data : new this._libraryClass(id, data);

    this._records[id] = dataEntry;
    this._lastUpdatedAt = Date.now();
    return this._records[id];
  }

  /**
   * Deletes a single record to the collection
   * @param {string} id
   */
  removeRecord(id) {
    delete this._records[id];
    this._lastUpdatedAt = Date.now();
  }

  /**
   * Find record by id
   * @param {string} id
   * @returns {object}
   */
  findByID(id) {
    const response = this._records[id];
    if (!response) {
      throw Error(`Failed to find record of id ${id} in ${this._collectionName}`);
    }

    return response;
  }

  /**
   * It refreshes the createdAt date so collection is no longer dirty
   */
  refresh() {
    this._createdAt = this._lastUpdatedAt;
  }

  /**
   * Deletes all data and resets collection
   */
  reset() {
    this._records = {};
    this._createdAt = Date.now();
    this._lastUpdatedAt = this._createdAt;
  }
}
