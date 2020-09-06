/**
 * Collection of URN utilities
 */

/**
 * Builds AlbumUrn [<title>:<albumID(optional)>]
 * @param {object} data
 * @returns {string}
 */
export function buildAlbumUrn({ title, albumID = '' }) {
  if (!title) {
    throw Error('title is required to build an AlbumUrn');
  }

  return `album:${title}:${albumID}`;
}

/**
 * Parses AlbumUrn [<title>:<albumID(optional)>]
 * @param {urn} data
 * @returns {object}
 */
export function parseAlbumUrn(urn) {
  const [type, title, id] = urn.split(':');
  return {
    title,
    id: id || null,
    type: `${type}/snippet`,
  };
}

/**
 * Builds ArtistUrn [<name>:<artistID(optional)>]
 * @param {object} data
 * @returns {string}
 */
export function buildArtistUrn({ name, id = '' }) {
  if (!name) {
    throw Error('name is required to build an ArtistUrn');
  }

  return `artist:${name}:${id}`;
}

/**
 * Parses ArtistUrn [<name>:<artistID(optional)>]
 * @param {urn} data
 * @returns {object}
 */
export function parseArtistUrn(urn) {
  const [type, name, id] = urn.split(':');
  return {
    name,
    id: id || null,
    type: `${type}/snippet`,
  };
}

/**
 * Builds MemberUrn [member:<birthdate>:<memberID>:<colorID>]
 * @param {object} data
 * @returns {string}
 */
export function buildMemberUrn({ birthdate, id, name, color }) {
  if (!birthdate) {
    throw Error('birthdate is required to build an MemberUrn');
  }
  if (!id) {
    throw Error('id is required to build an MemberUrn');
  }
  if (!name) {
    throw Error('name is required to build an MemberUrn');
  }
  if (!color) {
    throw Error('color is required to build an MemberUrn');
  }

  return `member:${birthdate}:${id}:${name}:${color}`;
}

/**
 * Parses MemberUrn [member:<birthdate>:<memberID>:colorID]
 * @param {urn} data
 * @returns {object}
 */
export function parseMemberUrn(urn) {
  const [type, birthdate, id, name, colorID] = urn.split(':');
  return {
    id,
    type: `${type}/snippet`,
    birthdate,
    name,
    colorID,
  };
}

/**
 * Builds SongUrn [<title>:<songID(optional)]
 * @param {object} data
 * @returns {string}
 */
export function buildSongUrn({ title, songID = '' }) {
  if (!title) {
    throw Error('title is required to build an SongUrn');
  }

  return `song:${title}:${songID}`;
}

/**
 * Parses SongUrn [<title>:<songID(optional)]
 * @param {urn} data
 * @returns {object}
 */
export function parseSongUrn(urn) {
  const [type, title, id] = urn.split(':');
  return {
    title,
    id: id || null,
    type: `${type}/snippet`,
  };
}
