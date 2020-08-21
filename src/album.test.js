import Album from './album';

describe('Album', function () {
  const ID = 'abc123';

  it('constructs an Album instance', function () {
    const album = new Album('ID');
    expect(album instanceof Album).toBeTruthy();
  });

  describe('getters', function () {
    describe('data', function () {
      it('returns ready to use data', function () {
        const album = new Album('abc345', {
          name: 'Test',
          artistUrn: 'Test:abc',
          category: 'ALBUM',
          id: 'abc123',
          isPrivate: true,
          releaseDate: 20000101,
          tracklistUrns: ['Test:fgh'],
        });

        expect(album.data).toEqual({
          artistId: 'abc',
          artistName: 'Test',
          category: 'ALBUM',
          id: 'abc123',
          isPrivate: true,
          name: 'Test',
          query: 'test test test',
          releaseDate: 20000101,
          tracklist: [{ id: 'fgh', title: 'Test', trackNumber: 1 }],
          type: 'album',
        });
      });

      it('returns ready to use data with default values', function () {
        const album = new Album(ID, { name: 'Test', artistUrn: 'Test' });

        expect(album.data).toEqual({
          artistId: undefined,
          artistName: 'Test',
          category: 'UNKNOWN',
          id: 'abc123',
          isPrivate: false,
          name: 'Test',
          query: 'test test',
          releaseDate: null,
          tracklist: [],
          type: 'album',
        });
      });

      it('throws errors if data is invalid', function () {
        function catcher() {
          return new Album(ID).data;
        }
        expect(catcher).toThrowError(
          "Album validation has failed: Missing required property 'name'"
        );
      });
    });

    describe('artistSnippet', function () {
      it('returns the artistSnippet correctly', function () {
        const album = new Album(ID, {
          name: 'Test',
          artistUrn: 'Test:cde',
        });
        expect(album.artistSnippet).toEqual({ id: 'cde', name: 'Test' });
      });
    });

    describe('tracklist', function () {
      it('returns the tracklist correctly', function () {
        const album = new Album(ID, {
          name: 'Test',
          artistUrn: 'Test',
          tracklistUrns: ['Test:fgh', 'Title'],
        });
        const result = album.tracklist;
        expect(Array.isArray(result)).toBeTruthy();
        expect(result).toEqual([
          { id: 'fgh', title: 'Test', trackNumber: 1 },
          { id: null, title: 'Title', trackNumber: 2 },
        ]);
      });

      it('returns the empty array when no urns are present', function () {
        const album = new Album(ID, {
          name: 'Test',
          artistUrn: 'Test',
        });
        const result = album.tracklist;
        expect(Array.isArray(result)).toBeTruthy();
        expect(result).toEqual([]);
      });
    });

    describe('query', function () {
      it('returns the query correctly', function () {
        const album = new Album(ID, {
          name: 'Test',
          artistUrn: 'Bob',
          tracklistUrns: ['Bola:fgh', 'Title'],
        });
        expect(album.query).toEqual('test bob bola title');
      });
    });

    describe('relationships', function () {
      it('returns the relationships correctly', function () {
        const album = new Album('abc345', {
          name: 'Test',
          artistUrn: 'Test:abc',
          category: 'ALBUM',
          id: 'abc123',
          isPrivate: true,
          releaseDate: 20000101,
          tracklistUrns: ['Test:fgh'],
        });

        expect(album.relationships).toEqual({
          artist: { data: { id: 'abc', type: 'artist' } },
          songs: { data: [{ id: 'fgh', type: 'song' }] },
        });
      });

      it('returns only the relationships keys that are present', function () {
        const album = new Album(ID, { name: 'Test', artistUrn: 'Test' });

        expect(album.relationships).toEqual({});
      });
    });
  });

  describe('methods', function () {
    describe('validate', function () {
      it('returns true if name and genre are correct', function () {
        const album = new Album(ID, {
          name: 'Test',
          artistUrn: 'Test',
        });
        expect(album.validate()).toBeTruthy();
      });

      it('throws error if name does not exist', function () {
        function catcher() {
          return new Album().validate();
        }

        expect(catcher).toThrowError(
          "Album validation has failed: Missing required property 'name'"
        );
      });

      it('throws error if genre is not part of the GENRES enum', function () {
        function catcher() {
          return new Album(ID, { name: 'Test', category: 'MARIACHI' }).validate();
        }

        expect(catcher).toThrowError("'MARIACHI' is not part of Enum(ALBUMS)");
      });
    });

    describe('deserialize', function () {
      it('works correctly with a complete set of data', function () {
        const album = new Album(ID, {
          name: 'Test',
          artistUrn: 'Test:abc',
          category: 'ALBUM',
          id: 'abc123',
          isPrivate: true,
          releaseDate: 20000101,
          tracklistUrns: ['Test:fgh'],
        });
        const result = album.deserialize();
        expect(result).toEqual({
          body: {
            artistUrn: 'Test:abc',
            category: 'ALBUM',
            isPrivate: true,
            name: 'Test',
            releaseDate: 20000101,
            tracklistUrns: ['Test:fgh'],
          },
          id: 'abc123',
        });
      });

      it('works correctly omitting optional data', function () {
        const album = new Album(ID, { name: 'Test', artistUrn: 'Test:abc' });
        const result = album.deserialize();
        expect(result).toEqual({
          body: {
            artistUrn: 'Test:abc',
            category: null,
            isPrivate: null,
            name: 'Test',
            releaseDate: null,
            tracklistUrns: null,
          },
          id: 'abc123',
        });
      });
    });

    describe('serialize', function () {
      let album = null;

      const testList = [
        ['id', null, '123'],
        ['name', 'Test', '123'],
        ['isPrivate', false, true],
        ['category', 'UNKNOWN', 'SINGLE'],
        ['releaseDate', null, 20200101],
      ];

      beforeEach(function () {
        album = new Album(null, { name: 'Test', artistUrn: 'Test:abc' });
      });

      test.each(testList)('sets %s', function (property, defaultValue, value) {
        expect(album.data[property]).toEqual(defaultValue);
        expect(album.serialize({ [property]: value })[property]).toEqual(value);
      });

      it('sets artistUrn', function () {
        expect(album.data.artistName).toEqual('Test');
        expect(album.data.artistId).toEqual('abc');
        album.serialize({ artistUrn: 'Bob:abc123' });
        expect(album.artistSnippet).toEqual({ id: 'abc123', name: 'Bob' });
      });

      it('sets tracklistUrns', function () {
        expect(album.data.tracklist).toEqual([]);
        expect(album.serialize({ tracklistUrns: ['SongTitle:mno'] }).tracklist).toEqual([
          { id: 'mno', title: 'SongTitle', trackNumber: 1 },
        ]);
      });
    });

    describe('addTrack', function () {
      it('adds a track correctly', function () {
        const album = new Album(null, { name: 'Test', artistUrn: 'Test:abc' });

        expect(album.data.tracklist).toEqual([]);

        album.addTrack('Bob', 'abc123');

        expect(album.data.tracklist).toEqual([{ id: 'abc123', title: 'Bob', trackNumber: 1 }]);
      });

      it('adds a track in a specific position correctly', function () {
        const album = new Album(null, { name: 'Test', artistUrn: 'Test:abc' });

        expect(album.data.tracklist).toEqual([]);

        album.addTrack('Bob', 'abc123', 3);

        expect(album.data.tracklist).toEqual([
          undefined,
          undefined,
          { id: 'abc123', title: 'Bob', trackNumber: 3 },
        ]);
      });
    });
  });
});
