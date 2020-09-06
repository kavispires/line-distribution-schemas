import Album from './album';
import Artist from './artist';
import Member from './member';
import Unit from './unit';

/**
 * Build property relationship between two libraries
 * @param {*} parentLibrary
 * @param {*} childLibrary
 */
export function connect(parentLibrary, childLibrary) {
  const childErrorMessage = `Connect no supported for child library ${childLibrary.type} with parent library`;

  switch (parentLibrary.type) {
    case 'artist':
      // Artist => Unit
      if (isUnit(childLibrary)) {
        parentLibrary.connectUnit(childLibrary.id);
        childLibrary.connectArtist(parentLibrary.id);
        return true;
      }
      // Artist => Member
      if (isMember(childLibrary)) {
        parentLibrary.connectMember(childLibrary.data);
        childLibrary.connectReferenceArtist(parentLibrary.data);
        return true;
      }

      throw Error(childErrorMessage);
    case 'unit':
      // Unit => Artist
      // Unit => Member
      // Unit => Album
      // Unit => Distribution
      throw Error(childErrorMessage);

    case 'member':
      // Member => Artist

      throw Error(childErrorMessage);

    case 'album':
      // Album => Song
      // Album => Artist

      throw Error(childErrorMessage);

    case 'song':
      // Song => Distribution
      // Song => Distribution

      throw Error(childErrorMessage);

    case 'distribution':
      // Distribution => Song
      // Distribution => Unit

      throw Error(childErrorMessage);

    default:
      throw Error(`Connect no supported for parent library ${parentLibrary.type}`);
  }
}

// function isArtist(library) {
//   return library instanceof Artist;
// }

function isUnit(library) {
  return library instanceof Unit;
}

function isMember(library) {
  return library instanceof Member;
}

// function isAlbum(library) {
//   return library instanceof Album;
// }
