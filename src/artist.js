import LD from "./ld";
import { Enum } from "./enum";

/**
 * Artist Class
 * Relationships:
 * - Units (OneToMany)
 * - Members:Urns (ManyToMany)
 */
export default class Artist extends LD {
  constructor(id, data) {
    super(id, "artist");

    // Required Properties
    this._name = null;

    // Optional Properties
    this._genre = Enum.GENRES.UNKNOWN;
    this._agency = null;
    this._otherNames = "";
    this._isPrivate = false;
    this._isDisbanded = false;
    this._isSoloist = false;

    // Direct References
    this._unit_ids = []; // Reference: Unit

    // Urn References
    this._memberUrns = []; // Type:Birthdate:MemberID:Name:ColorID

    if (data) this.serialize(data);
  }

  // Property types
  types = {
    _name: "string",
    _genre: "Enum:GENRES",
    _agency: "string:optional",
    _otherNames: "string:optional",
    _isPrivate: "boolean:optional",
    _isDisbanded: "boolean:optional",
    _isSoloist: "boolean:optional",
    _unit_ids: "array:optional",
    _memberUrns: "array:optional",
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
      agency: this._agency ?? Enum.unknown,
      genre: this._genre ?? Enum.GENRES.UNKNOWN,
      otherNames: this._otherNames,
      isPrivate: this._isPrivate ?? false,
      isDisbanded: this._isDisbanded ?? false,
      isSoloist: this._isSoloist ?? false,
      unitIDs: this._unit_ids ?? [],
      membersSnippet: this.membersSnippet,
      query: this.query,
    };
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
    const membersNames = this.membersSnippet
      .map((member) => member.name)
      .join(" ");
    return `${this._name ?? ""} ${this._otherNames ?? ""} ${
      membersNames ?? ""
    } ${this._agency ?? ""}`
      .toLowerCase()
      .trim();
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
        agency: this.getKnownEnumValue(this._agency),
        genre: this.getKnownEnumValue(this._genre),
        otherNames: this._otherNames || null,
        isPrivate: this._isPrivate || null,
        isDisbanded: this._isDisbanded || null,
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
    if (data.agency) this._agency = data.agency;
    if (data.otherNames) this._otherNames = data.otherNames;
    if (data.isPrivate) this._isPrivate = data.isPrivate;
    if (data.isDisbanded) this._isDisbanded = data.isDisbanded;
    if (data.isSoloist) this._isSoloist = data.isSoloist;
    if (data.unitIDs) this._unit_ids = data.unitIDs;
    if (data.memberUrns) this._memberUrns = data.memberUrns;
    // Validate and add Enums
    if (data.genre && Enum.validate("GENRES", data.genre))
      this._genre = data.genre;

    this.validate();

    return this.data;
  }

  /**
   * Adds a member urn to the list of member urns
   * @param {object} data
   * @returns the members snippet
   */
  addMemberUrn(data) {
    this._memberUrns.push(this.buildMemberUrn(data));
    return this.membersSnippet;
  }

  /**
   * Parses the list of member urns (Type:Birthdate:MemberID:Name:ColorID) into a list of member snippet objects
   * @returns {object[]}
   */
  _parseMemberUrns() {
    return (this._memberUrns ?? []).sort().map(this.parseMemberUrn);
  }

  /**
   * Builds a list of member snippet objects into a list of member urns
   * @param {object[]} members
   * @returns {string[]} list of artist-member urns
   */
  _buildMemberUrns(members) {
    return Object.values(members).map(this.buildMemberUrn);
  }

  /**
   * Parses a member urns  into a member snippet object
   * @param {str} urn (Type:Birthdate:MemberID:Name:ColorID)
   * @returns {object}
   */
  parseMemberUrn(urn) {
    const [type, birthdate, id, name, colorID] = urn.split(":");
    return {
      id,
      type: `${type}/snippet`,
      birthdate,
      name,
      colorID,
    };
  }

  /**
   * Builds a member urn off a member snippet object
   * @param {object} memberSnippet
   * @returns {string} an artist-member urn
   */
  buildMemberUrn({ birthdate, id, name, colorID }) {
    return `member:${birthdate}:${id}:${name}:${colorID}`;
  }
}
