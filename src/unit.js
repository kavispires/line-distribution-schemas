import { Enum } from "./enum";
import LD from "./ld";

/**
 * Unit Class
 * Relationships:
 * - Artist (OneToMany)
 * - Members
 * - Albums
 * - Distributions
 */
export default class Unit extends LD {
  constructor(id, data) {
    super(id, "unit");

    // Required Properties
    this._name = null;
    this._debutYear = null;

    // Optional Properties
    this._kind = Enum.UNITS.NA;
    this._isPrivate = false;
    this._isCustom = false;

    // Direct References
    this._artist_id = null;
    this._album_ids = [];
    this._distribution_ids = [];

    // Urn References
    this._membersPositionHash = {}; // MemberID:Name:PositionType : PositionLevel
    this._membersStatsHash = {}; // MemberID: OfficialPercentage:CustomPercentage:AllPercentage

    if (data) this.serialize(data);
  }

  // Property types
  types = {
    _name: "string",
    _debutYear: "number",
    _kind: "Enum:UNITS",
    _isPrivate: "boolean:optional",
    _artist_id: "string:optional",
    _album_ids: "array:optional",
    _distribution_ids: "array:optional",
    _membersPositionHash: "object:optional",
    _membersStatsHash: "object:optional",
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
      debutYear: this._debutYear,
      kind: this._kind,
      isPrivate: this._isPrivate ?? false,
      isCustom: this._isCustom ?? false,
      artistID: this._artist_id ?? null,
      albumIDs: this._album_ids ?? [],
      distributionIDs: this._distribution_ids ?? [],
      membersSnippet: this.parseUnitMembersHash(),
    };
  }

  /**
   * Determine members ids based on ids present in members hashes
   */
  get memberIDs() {
    return this.parseUnitMembersHash().map((entry) => entry.id);
  }

  /**
   * Prepares data for database save
   */
  deserialize() {
    this.validate();

    return {
      id: this._id ?? null,
      body: {
        name: this._name,
        debutYear: this._debutYear,
        kind: this.getKnownEnumValue(this._kind),
        isPrivate: this._isPrivate || null,
        isCustom: this._isCustom || null,
        artistID: this._artist_id || null,
        albumIDs: this.getKnownObjectValue(this._album_ids),
        distributionIDs: this.getKnownObjectValue(this._distribution_ids),
        membersPositionHash: this.getKnownObjectValue(
          this._membersPositionHash
        ),
        membersStatsHash: this.getKnownObjectValue(this._membersStatsHash),
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
    if (data.debutYear) this._debutYear = data.debutYear;
    if (data.isPrivate) this._isPrivate = data.isPrivate;
    if (data.isCustom) this._isCustom = data.isCustom;
    if (data.artistID) this._artist_id = data.artistID;
    if (data.albumIDs) this._album_ids = data.albumIDs;
    if (data.distributionIDs) this._distribution_ids = data.distributionIDs;
    if (data.membersPositionHash)
      this._membersPositionHash = data.membersPositionHash;
    if (data.membersStatsHash) this._membersStatsHash = data.membersStatsHash;

    // Validate and add Enums
    if (data.kind && Enum.validate("UNITS", data.kind)) this._kind = data.kind;

    this.validate();

    return this.data;
  }

  /**
   * Builds a members snippet with positions and stats information
   * @returns {object[]}
   */
  parseUnitMembersHash() {
    const dict = {};

    // MemberID:Name:PositionType : PositionLevel
    Object.entries(this._membersPositionHash ?? {}).forEach(([hash, level]) => {
      const [id, name, position] = hash.split(":");
      if (dict[id] === undefined) {
        dict[id] = {
          positions: [],
        };
      }
      dict[id].id = id;
      dict[id].name = name;
      dict[id].positions.push(buildPosition(position, level));
    });

    // MemberID: OfficialPercentage:CustomPercentage:TotalPercentage
    Object.entries(this._membersStatsHash ?? {}).forEach(([id, stats]) => {
      const [official, custom, total] = stats.split(":");
      if (dict[id] === undefined) {
        dict[id] = {
          id,
        };
      }

      dict[id].stats = {
        official: Number(official ?? 0),
        custom: Number(custom ?? 0),
        total: Number(total ?? 0),
      };
    });

    return Object.values(dict).map((entry) => entry);
  }
}

// Utils

/**
 * Builds position value
 * @param {string} position one of Enum(Positions)
 * @param {string|boolean} level  one of Enum(Positions/Level)
 */
function buildPosition(position, level) {
  if (!level || level === "REGULAR" || level === true) {
    return position;
  }

  return `${level}_${position}`;
}
