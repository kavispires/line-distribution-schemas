/**
 * Collection of URN utilities
 */

/**
 * Builds ArtistUrn [<name>:<artistID(optional)>]
 * @param {object} data
 * @returns {string}
 */
export function buildArtistUrn({ name, artistID = '' }) {
  if (!name) {
    throw Error('name is required to build an ArtistUrn');
  }

  return `artist:${name}:${artistID}`;
}

/**
 * Parses ArtistTurn [<name>:<artistID(optional)>]
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
export function buildMemberUrn({ birthdate, id, name, colorID }) {
  if (!birthdate) {
    throw Error('birthdate is required to build an MemberUrn');
  }
  if (!id) {
    throw Error('id is required to build an MemberUrn');
  }
  if (!name) {
    throw Error('name is required to build an MemberUrn');
  }
  if (!colorID) {
    throw Error('colorID is required to build an MemberUrn');
  }

  return `member:${birthdate}:${id}:${name}:${colorID}`;
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
