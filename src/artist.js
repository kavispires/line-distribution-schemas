import LD from './ld';
import { Enum } from './enum';
import * as urns from './urns';

/**
 * Artist Class
 */
export default class Artist extends LD {
  constructor(id, data) {
    super(id, 'artist');

    // Required Properties
    this._name = null;
    this._debutYear = null;

    // Optional Properties
    this._genre = Enum.GENRES.UNKNOWN;
    this._agency = null;
    this._otherNames = '';
    this._isPrivate = false;
    this._isSoloist = false;
    this._disbandmentYear = null;

    // Direct References
    this._unit_ids = []; // Reference: Unit

    // Urn References
    this._memberUrns = []; // [member:<birthdate>:<memberID>:colorID]

    if (data) this.serialize(data);
  }

  // Property types
  types = {
    _name: 'string',
    _debutYear: 'number',
    _disbandmentYear: 'number:optional',
    _genre: 'Enum:GENRES',
    _agency: 'string:optional',
    _otherNames: 'string:optional',
    _isPrivate: 'boolean:optional',
    _isSoloist: 'boolean:optional',
    _unit_ids: 'array:optional',
    _memberUrns: 'array:optional',
  };

  /**
   * Get parsed artist data
   * @returns {object}
   */
  get data() {
    this.validate();

    return {
      id: this._id,
      type: this._type,

      name: this._name,
      debutYear: this._debutYear,
      disbandmentYear: this._disbandmentYear,
      agency: this._agency ?? Enum.unknown,
      genre: this._genre ?? Enum.GENRES.UNKNOWN,
      otherNames: this._otherNames,
      isPrivate: this._isPrivate ?? false,
      isDisbanded: this.isDisbanded,
      isSoloist: this._isSoloist ?? false,
      unitIDs: this._unit_ids ?? [],
      membersSnippet: this.membersSnippet,
    };
  }

  /**
   * Get JSON:API relationships object
   * @returns {object}
   */
  get relationships() {
    return {
      members: {
        data: this.membersSnippet.map((entry) => ({ type: 'member', id: entry.id })),
      },
      units: {
        data: this._unit_ids.map((unitID) => ({ type: 'unit', id: unitID })),
      },
    };
  }

  /**
   * Flag that determines if a group has disbanded
   */
  get isDisbanded() {
    return Boolean(this._disbandmentYear);
  }

  /**
   * Get member snippet
   * @returns {object[]}
   */
  get membersSnippet() {
    return this._parseMemberUrns();
  }

  /**
   * Builds a query string to be used in searches
   * @returns {string}
   */
  get query() {
    const membersNames = this.membersSnippet.map((member) => member.name).join(' ');
    return `${this._name ?? ''} ${this._otherNames ?? ''} ${membersNames ?? ''} ${
      this._agency ?? ''
    }`
      .toLowerCase()
      .trim();
  }

  /**
   * Get artist typeahead object
   * @returns {object}
   */
  get typeahead() {
    return {
      value: this._id,
      text: this._name,
      query: this.query,
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
        debutYear: this._debutYear,
        disbandmentYear: this._disbandmentYear || null,
        agency: this.getKnownEnumValue(this._agency),
        genre: this.getKnownEnumValue(this._genre),
        otherNames: this._otherNames || null,
        isPrivate: this._isPrivate || null,
        isSoloist: this._isSoloist || null,
        unitIDs: this.getKnownObjectValue(this._unit_ids),
        memberUrns: this.getKnownObjectValue(this._memberUrns),
      },
    };
  }

  /**
   * Internally updates Artist data
   * @param {object} data
   * @returns {object} the parsed artist data
   */
  serialize(data) {
    this.validateType(data);

    if (data.id) this._id = data.id;
    if (data.name) this._name = data.name;
    if (data.debutYear) this._debutYear = data.debutYear;
    if (data.disbandmentYear) this._disbandmentYear = data.disbandmentYear;
    if (data.agency) this._agency = data.agency;
    if (data.otherNames) this._otherNames = data.otherNames;
    if (data.isPrivate) this._isPrivate = data.isPrivate;
    if (data.isSoloist) this._isSoloist = data.isSoloist;
    if (data.unitIDs) this._unit_ids = data.unitIDs;
    if (data.memberUrns) this._memberUrns = data.memberUrns;
    // Validate and add Enums
    if (data.genre && Enum.validate('GENRES', data.genre)) this._genre = data.genre;

    this.validate();

    return this.data;
  }

  /**
   * Adds a member urn to the list of member urns
   * @param {object} data
   * @returns the members snippet
   */
  connectMember(memberData) {
    if (this._memberUrns.find((entry) => entry.includes(memberData.id))) {
      console.warn(`Member ID ${memberData.id} is already connected to artist ${this.id}`);
    } else {
      this._memberUrns.push(urns.buildMemberUrn(memberData));
    }
    return this.membersSnippet;
  }

  /**
   * Adds unitID to list of unit references if not yet present
   * @param {string} unitID
   * @returns {string[]} the list of unit ids
   */
  connectUnit(unitID) {
    if (this._unit_ids.find((id) => id === unitID)) {
      console.warn(`Unit ID ${unitID} is already connected to artist ${this.id}`);
    } else {
      this._unit_ids.push(unitID);
    }
    return this._unit_ids;
  }

  /**
   * Parses the list of member urns (Type:Birthdate:MemberID:Name:ColorID) into a list of member snippet objects
   * @returns {object[]}
   */
  _parseMemberUrns() {
    return (this._memberUrns ?? []).sort().map(urns.parseMemberUrn);
  }

  /**
   * Builds a list of member snippet objects into a list of member urns
   * @param {object[]} members
   * @returns {string[]} list of artist-member urns
   */
  _buildMemberUrns(members) {
    return Object.values(members).map(urns.buildMemberUrn);
  }
}
