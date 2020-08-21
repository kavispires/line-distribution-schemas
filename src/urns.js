/**
 * Collection of URN utilities
 */

/**
 * Builds AlbumArtistTurn [<name>:<artistID(optional)>]
 * @param {object} data
 * @returns {string}
 */
export function buildAlbumArtistUrn({ name, artistID = '' }) {
  if (!name) {
    throw Error('name is required to build an AlbumArtistUrn');
  }

  return `artist:${name}:${artistID}`;
}

/**
 * Parses AlbumArtistTurn [<name>:<artistID(optional)>]
 * @param {urn} data
 * @returns {object}
 */
export function parseAlbumArtistUrn(urn) {
  const [type, name, id] = urn.split(':');
  return {
    name,
    id: id || null,
    type: `${type}/snippet`,
  };
}

/**
 * Builds AlbumSongUrn [<title>:<songID(optional)]
 * @param {object} data
 * @returns {string}
 */
export function buildAlbumSongUrn({ title, songID = '' }) {
  if (!title) {
    throw Error('title is required to build an AlbumSongUrn');
  }

  return `song:${title}:${songID}`;
}

/**
 * Parses AlbumSongUrn [<title>:<songID(optional)]
 * @param {urn} data
 * @returns {object}
 */
export function parseAlbumSongUrn(urn) {
  const [type, title, id] = urn.split(':');
  return {
    title,
    id: id || null,
    type: `${type}/snippet`,
  };
}

/**
 * Builds ArtistMEmberUrn [member:<birthdate>:<memberID>:<colorID>]
 * @param {object} data
 * @returns {string}
 */
export function buildArtistMemberUrn({ birthdate, id, name, colorID }) {
  if (!birthdate) {
    throw Error('birthdate is required to build an ArtistMemberUrn');
  }
  if (!id) {
    throw Error('id is required to build an ArtistMemberUrn');
  }
  if (!name) {
    throw Error('name is required to build an ArtistMemberUrn');
  }
  if (!colorID) {
    throw Error('colorID is required to build an ArtistMemberUrn');
  }

  return `member:${birthdate}:${id}:${name}:${colorID}`;
}

/**
 * Parses ArtistMemberUrn [member:<birthdate>:<memberID>:colorID]
 * @param {urn} data
 * @returns {object}
 */
export function parseArtistMemberUrn(urn) {
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
 * Builds MemberArtistUrn [artist:<artistID>:<name>]
 * @param {object} data
 * @returns {string}
 */
export function buildMemberArtistUrn({ artistID, name }) {
  if (!artistID) {
    throw Error('artistID is required to build an MemberArtistUrn');
  }
  if (!name) {
    throw Error('name is required to build an MemberArtistUrn');
  }

  return `artist:${artistID}:${name}`;
}

/**
 * Parses MemberArtistUrn [artist:<artistID>:<name>]
 * @param {urn} data
 * @returns {object}
 */
export function parseMemberArtistUrn(urn) {
  const [type, id, name] = urn.split(':');
  return {
    id,
    name,
    type: `${type}/snippet`,
  };
}
