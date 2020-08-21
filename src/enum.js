export default class EnumClass {
  constructor() {
    this._unknown = 'UNKNOWN';
    this._na = 'NA';

    this.ALBUMS = {
      ALBUM: 'ALBUM',
      EP: 'EP',
      SINGLE: 'SINGLE',
      UNKNOWN: this._unknown,
    };
    this.GENDERS = {
      FEMALE: 'FEMALE',
      MALE: 'MALE',
      UNKNOWN: this._unknown,
    };
    this.GENRES = {
      CPOP: 'CPOP',
      JPOP: 'JPOP',
      KPOP: 'KPOP',
      OTHER: 'OTHER',
      POP: 'POP',
      UNKNOWN: this._unknown,
    };
    this.NATIONALITIES = {
      AMERICAN: 'AMERICAN',
      BRAZILIAN: 'BRAZILIAN',
      BRITISH: 'BRITISH',
      CANADIAN: 'CANADIAN',
      CHINESE: 'CHINESE',
      INDIAN: 'INDIAN',
      INDONESIAN: 'INDONESIAN',
      FILIPINO: 'FILIPINO',
      JAPANESE: 'JAPANESE',
      KOREAN: 'KOREAN',
      OTHER: 'OTHER',
      TAIWANESE: 'TAIWANESE',
      THAI: 'THAI',
      VIETNAMESE: 'VIETNAMESE',
      PLANTIAN: 'PLANTIAN',
      UNKNOWN: this._unknown,
    };
    this.POSITIONS = {
      VOCALIST: {
        MAIN: 'MAIN_VOCALIST',
        LEAD: 'LEAD_VOCALIST',
        REGULAR: 'VOCALIST',
        SUB: 'SUB_VOCALIST',
      },
      DANCER: {
        MAIN: 'MAIN_DANCER',
        LEAD: 'LEAD_DANCER',
        REGULAR: 'DANCER',
      },
      RAPPER: {
        MAIN: 'MAIN_RAPPER',
        LEAD: 'LEAD_RAPPER',
        REGULAR: 'RAPPER',
      },
      PERFORMER: 'PERFORMER',
      LEADER: 'LEADER',
      FACE: 'FACE',
      CENTER: 'CENTER',
      MAKNAE: 'MAKNAE',
      VISUAL: 'VISUAL',
      OTHER: 'OTHER',
    };
    this.UNITS = {
      CUSTOM: 'CUSTOM',
      NA: this._na,
      SOLO: 'SOLO',
      SPECIAL: 'SPECIAL',
      SUBUNIT: 'SUBUNIT',
    };
  }

  get unknown() {
    return this._unknown;
  }

  get notAvailable() {
    return this._na;
  }

  /**
   * Gets a list of keys of given enum type
   * @param {string} type
   * @returns {string[]}
   */
  list(type) {
    this.validateType(type);
    return Object.keys(this[type]);
  }

  /**
   * Validates a enum value based on its type
   * @param {string} type
   * @param {string} value
   */
  validate(type, value) {
    this.validateType(type);

    if (!Boolean(this[type][value])) {
      throw new Error(`'${value}' is not part of Enum(${type})`);
    }

    return true;
  }

  validateType(type) {
    if (!this[type]) {
      throw Error(`Invalid Enum type '${type}'`);
    }
  }
}

export const Enum = new EnumClass();
