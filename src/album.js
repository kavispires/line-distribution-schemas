import LD from './ld';
import { Enum } from './enum';
import * as urns from './urns';

/**
 * Album Class
 */
export default class Album extends LD {
  constructor(id, data) {
    super(id, 'album');

    // Required Properties
    this._name = null;
    this._artistUrn = null; // [<name>:<artistID(optional)>]

    // Optional Properties
    this._category = Enum.ALBUMS.UNKNOWN;
    this._isPrivate = false;
    this._releaseDate = null;

    // Direct References

    // Urn References
    this._tracklistUrns = []; // [<title>:<songID(optional)]

    if (data) this.serialize(data);
  }

  // Property types
  types = {
    _name: 'string',
    _artistUrn: 'string',
    _category: 'Enum:ALBUMS',
    _isPrivate: 'boolean:optional',
    _releaseDate: 'Date:optional',
    _tracklistUrns: 'array:optional',
  };

  /**
   * Get parsed album data
   * @returns {object}
   */
  get data() {
    this.validate();

    return {
      id: this._id,
      type: this._type,
      name: this._name,
      isPrivate: this._isPrivate ?? false,
      category: this._category,
      releaseDate: this._releaseDate,
      tracklist: this.tracklist,
      artistName: this.artistSnippet.name,
      artistId: this.artistSnippet.id,
    };
  }

  /**
   * Get JSON:API relationships object
   * @returns {object}
   */
  get relationships() {
    const result = {};

    if (this.artistSnippet.id) {
      result.artist = {
        data: { type: 'artist', id: this.artistSnippet.id },
      };
    }

    const songs = [];
    this.tracklist.forEach((track) => {
      if (track.id) {
        songs.push({ type: 'song', id: track.id });
      }
    });

    if (songs.length > 0) {
      result.songs = {
        data: songs,
      };
    }

    return result;
  }

  /**
   * Get artist snippet
   * @returns {object[]}
   */
  get artistSnippet() {
    return urns.parseArtistUrn(this._artistUrn);
  }

  /**
   * Get album object
   * @returns {object[]}
   */
  get tracklist() {
    return this._parseTracklistUrns();
  }

  /**
   * Builds a query string to be used in searches
   * @returns {string}
   */
  get query() {
    return `${this._name} ${this.artistSnippet.name} ${this.tracklist
      .map((track) => track.title)
      .join(' ')}`
      .toLowerCase()
      .trim();
  }

  /**
   * Get album typeahead object
   * @returns {object}
   */
  get typeahead() {
    return {
      value: this._id,
      text: `${this._name} (${this.artistSnippet.name})`,
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
        artistUrn: this._artistUrn,
        category: this.getKnownEnumValue(this._category),
        isPrivate: this._isPrivate || null,
        name: this._name,
        releaseDate: this._releaseDate || null,
        tracklistUrns: this.getKnownObjectValue(this._tracklistUrns),
      },
    };
  }

  /**
   * Internally updates Album data
   * @param {object} data
   * @returns {object} the parsed album data
   */
  serialize(data) {
    this.validateType(data);

    if (data.id) this._id = data.id;
    if (data.name) this._name = data.name;
    if (data.artistUrn) this._artistUrn = data.artistUrn;
    if (data.isPrivate) this._isPrivate = data.isPrivate;
    if (data.releaseDate) this._releaseDate = data.releaseDate;
    if (data.tracklistUrns) this._tracklistUrns = data.tracklistUrns;

    // Validate and add Enums
    if (data.category && Enum.validate('ALBUMS', data.category)) this._category = data.category;

    this.validate();

    return this.data;
  }

  /**
   * Adds a track urn to the tracklist urns
   * @param {object} data
   * @returns the tracklist
   */
  addTrack(title, songID, trackNumber = 0) {
    const trackPosition = !trackNumber ? this._tracklistUrns.length : trackNumber - 1;

    this._tracklistUrns[trackPosition] = urns.buildSongUrn({ title, songID });
    return this.tracklist;
  }

  /**
   * Parses the list of trackUrns (Title:SongID(optional)) into a list of objects
   * @returns {object[]}
   */
  _parseTracklistUrns() {
    return this._tracklistUrns.map((urn, index) => {
      const { title, id } = urns.parseSongUrn(urn);
      return {
        title,
        id,
        trackNumber: index + 1,
      };
    });
  }
}
