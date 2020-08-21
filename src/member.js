import { Enum } from './enum';
import LD from './ld';
import * as urns from './urns';

/**
 * Member Class
 */
export default class Member extends LD {
  constructor(id, data) {
    super(id, 'member');

    // Required Properties
    this._name = null;
    this._color = null;

    // Optional Properties
    this._birthdate = null;
    this._initials = null;
    this._isHidden = false;
    this._isPrivate = false;
    this._gender = Enum.GENDERS.UNKNOWN;
    this._nationality = Enum.NATIONALITIES.UNKNOWN;
    this._primaryGenre = Enum.GENRES.UNKNOWN;
    this._meta = {};
    this._positions = [];
    this._tags = [];

    // Direct References

    // Urn References
    this._referenceArtists = {}; // [artist:<artistID>:<name>]

    if (data) this.serialize(data);
  }

  // Property types
  types = {
    _name: 'string',
    _color: 'number',
    _birthdate: 'number:optional',
    _initials: 'string:optional',
    _isHidden: 'boolean:optional',
    _isPrivate: 'boolean:optional',
    _gender: 'Enum:GENDERS',
    _nationality: 'Enum:NATIONALITIES',
    _primaryGenre: 'Enum:GENRES',
    _meta: 'object:optional',
    _positions: 'object:optional',
    _tags: 'array:optional',
    _referenceArtists: 'object',
  };

  /**
   * Get parsed unit data
   * @returns {object}
   */
  get data() {
    this.validate();

    return {
      id: this._id,
      type: this._type,
      name: this._name,
      initials: this._initials ?? buildMemberInitials(this._name),
      color: this._color,
      birthdate: this._birthdate,
      age: calculateAge(this._birthdate),
      isHidden: this._isHidden ?? false,
      isPrivate: this._isPrivate ?? false,
      gender: this._gender ?? Enum.GENDERS.UNKNOWN,
      nationality: this._nationality ?? Enum.NATIONALITIES.UNKNOWN,
      primaryGenre: this._primaryGenre ?? Enum.GENRES.UNKNOWN,
      positions: this._positions ?? [],
      referenceArtistsSnippet: this.referenceArtistsSnippet,
      tags: this._tags ?? [],
      meta: this._meta ?? {},
    };
  }

  /**
   * Get JSON:API relationships object
   * @returns {object}
   */
  get relationships() {
    return {
      artists: {
        data: this.referenceArtistsSnippet.map((entry) => ({ type: 'artist', id: entry.id })),
      },
      color: {
        data: { type: 'color', id: this._color },
      },
    };
  }

  /**
   * Builds reference artists snippet
   * @return {object}
   */
  get referenceArtistsSnippet() {
    return Object.keys(this._referenceArtists ?? {}).map(urns.parseMemberArtistUrn);
  }

  /**
   * Builds reference artists query containing all artists names
   * @return {string}
   */
  get referenceArtistsQuery() {
    return this.referenceArtistsSnippet
      .reduce((acc, entry) => `${acc} ${entry.name}`, '')
      .replace(/[{()}]/g, '')
      .toLowerCase()
      .trim();
  }

  /**
   * Get member typeahead object
   * @returns {object}
   */
  get typeahead() {
    const mainArtist = this.referenceArtistsSnippet[0]?.name ?? '';

    return {
      value: this._id,
      text: `${this._name} (${mainArtist})`,
      query: `${this._name} ${this.referenceArtistsQuery}`,
    };
  }

  /**
   * Prepares data for database save
   * @returns {object}
   */
  deserialize() {
    this.validate();

    return {
      id: this._id ?? null,
      body: {
        name: this._name,
        birthdate: this._birthdate,
        color: this._color,
        initials: this._initials || null,
        isPrivate: this._isPrivate || null,
        isHidden: this._isHidden || null,
        gender: this.getKnownEnumValue(this._genre),
        nationality: this.getKnownEnumValue(this._nationality),
        primaryGenre: this.getKnownEnumValue(this._primaryGenre),
        positions: this.getKnownObjectValue(uniqueList(this._positions ?? [])),
        referenceArtists: this.getKnownObjectValue(this._referenceArtists),
        tags: this.getKnownObjectValue(this._tags),
        meta: this.getKnownObjectValue(this._meta),
      },
    };
  }

  /**
   * Internally updates unit data
   * @param {object} data
   */
  serialize(data) {
    this.validateType(data);

    if (data.id) this._id = data.id;
    if (data.name) this._name = data.name;
    if (data.color) this._color = data.color;
    if (data.birthdate) this._birthdate = data.birthdate;
    if (data.initials) this._initials = data.initials;
    if (data.isPrivate) this._isPrivate = data.isPrivate;
    if (data.isHidden) this._isHidden = data.isHidden;
    if (data.positions) this._positions = data.positions;
    if (data.referenceArtists) this._referenceArtists = data.referenceArtists;
    if (data.tags) this._tags = data.tags;
    if (data.meta) this._meta = data.meta;

    // Validate and add Enums
    if (data.gender && Enum.validate('GENDERS', data.gender)) {
      this._gender = data.gender;
    }
    if (data.primaryGenre && Enum.validate('GENRES', data.primaryGenre)) {
      this._primaryGenre = data.primaryGenre;
    }
    if (data.nationality && Enum.validate('NATIONALITIES', data.nationality)) {
      this._nationality = data.nationality;
    }

    this.validate();

    return this.data;
  }

  /**
   * Builds and adds an urn to referenceArtists
   * @param {string} artistID
   * @param {string} artistName
   * @returns {object} updated
   */
  addReferenceArtistUrn(artistID, artistName) {
    if (!artistID || !artistName) {
      throw Error('artistID and artistName are required to add referenceArtistUrn');
    }
    const referenceArtists = this._referenceArtists ?? {};
    referenceArtists[urns.buildMemberArtistUrn({ artistID, name: artistName })] = true;
    this._referenceArtists = referenceArtists;

    return this.referenceArtistsSnippet;
  }

  /**
   * Adds a position to positions list
   * @param {string} position
   */
  addPosition(position) {
    if (!position) {
      throw Error('position is required');
    }
    const positions = [position, ...this._positions];
    this._positions = uniqueList(positions);
    return this._positions;
  }

  /**
   * Remove a position to positions list
   * @param {string} position
   */
  removePosition(position) {
    if (!position) {
      throw Error('position is required');
    }
    const positions = [...this._positions];
    const index = positions.indexOf(position);
    if (index > -1) {
      positions.splice(index, 1);
    }
    this._positions = positions;
    return this._positions;
  }
}

// Utils

/**
 * Build member initials based on their name
 * @param {string} name
 * @returns {string} a two-digit upper cased string
 */
function buildMemberInitials(name) {
  return `${name[0]}${name[Math.floor(name.length / 2)]}`.toUpperCase();
}

/**
 * Calculates the age of a member based on their birthday (YYYYMMDD) keeping a cache
 * @param {number} birthday
 * @returns {number} the age of the member
 */
const calculateAge = (function () {
  const cache = {};
  const TODAY = process.env.NODE_ENV === 'test' ? 1550000000000 : Date.now();
  return (birthdate) => {
    if (!birthdate) return 0;

    if (birthdate in cache) {
      return cache[birthdate];
    } else {
      const birthdateString = birthdate.toString();
      const birthDate = new Date(
        +birthdateString.substring(0, 4),
        +birthdateString.substring(4, 6),
        +birthdateString.substring(6)
      );

      const ageDate = new Date(TODAY - birthDate.getTime());
      cache[birthdate] = Math.abs(ageDate.getUTCFullYear() - 1970);
      return cache[birthdate];
    }
  };
})();

/**
 * Filters a list into a list of unique values
 * @param {array} list
 * @returns {array}
 */
function uniqueList(list) {
  return list.filter((value, index, self) => self.indexOf(value) === index).sort();
}
