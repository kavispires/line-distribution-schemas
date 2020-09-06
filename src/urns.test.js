import * as urns from './urns';

describe('urns', function () {
  describe('buildAlbumUrn', function () {
    it('works correctly', function () {
      expect(urns.buildAlbumUrn({ title: 'Test', albumID: 'abc' })).toEqual('album:Test:abc');
    });

    it('works with optional albumID correctly', function () {
      expect(urns.buildAlbumUrn({ title: 'Test' })).toEqual('album:Test:');
    });

    it('throws error if title is not provided', function () {
      function catcher() {
        return urns.buildAlbumUrn({});
      }

      expect(catcher).toThrowError('title is required to build an AlbumUrn');
    });
  });

  describe('parseAlbumUrn', function () {
    it('works correctly', function () {
      expect(urns.parseAlbumUrn('album:Test:abc')).toEqual({
        id: 'abc',
        title: 'Test',
        type: 'album/snippet',
      });
    });
  });

  describe('buildArtistUrn', function () {
    it('works correctly', function () {
      expect(urns.buildArtistUrn({ name: 'Test', artistID: 'abc' })).toEqual('artist:Test:abc');
    });

    it('works with optional artistID correctly', function () {
      expect(urns.buildArtistUrn({ name: 'Test' })).toEqual('artist:Test:');
    });

    it('throws error if name is not provided', function () {
      function catcher() {
        return urns.buildArtistUrn({});
      }

      expect(catcher).toThrowError('name is required to build an ArtistUrn');
    });
  });

  describe('parseArtistUrn', function () {
    it('works correctly', function () {
      expect(urns.parseArtistUrn('artist:Test:abc')).toEqual({
        id: 'abc',
        name: 'Test',
        type: 'artist/snippet',
      });
    });
  });

  describe('buildSongUrn', function () {
    it('works correctly', function () {
      expect(urns.buildSongUrn({ title: 'Test', songID: 'abc' })).toEqual('song:Test:abc');
    });

    it('works with optional songID correctly', function () {
      expect(urns.buildSongUrn({ title: 'Test' })).toEqual('song:Test:');
    });

    it('throws error if name is not provided', function () {
      function catcher() {
        return urns.buildSongUrn({});
      }

      expect(catcher).toThrowError('title is required to build an SongUrn');
    });
  });

  describe('parseSongUrn', function () {
    it('works correctly', function () {
      expect(urns.parseSongUrn('song:Test:abc')).toEqual({
        id: 'abc',
        title: 'Test',
        type: 'song/snippet',
      });
    });
  });

  describe('buildMemberUrn', function () {
    it('works correctly', function () {
      expect(
        urns.buildMemberUrn({ birthdate: 20200101, id: 'abc', name: 'Test', colorID: '1' })
      ).toEqual('member:20200101:abc:Test:1');
    });

    it('throws error if birthdate is not provided', function () {
      function catcher() {
        return urns.buildMemberUrn({});
      }

      expect(catcher).toThrowError('birthdate is required to build an MemberUrn');
    });

    it('throws error if id is not provided', function () {
      function catcher() {
        return urns.buildMemberUrn({ birthdate: 20200101 });
      }

      expect(catcher).toThrowError('id is required to build an MemberUrn');
    });

    it('throws error if name is not provided', function () {
      function catcher() {
        return urns.buildMemberUrn({ birthdate: 20200101, id: 'abc' });
      }

      expect(catcher).toThrowError('name is required to build an MemberUrn');
    });

    it('throws error if colorID is not provided', function () {
      function catcher() {
        return urns.buildMemberUrn({ birthdate: 20200101, id: 'abc', name: 'Test' });
      }

      expect(catcher).toThrowError('colorID is required to build an MemberUrn');
    });
  });

  describe('parseMemberUrn', function () {
    it('works correctly', function () {
      expect(urns.parseMemberUrn('member:20200101:abc:Test:1')).toEqual({
        birthdate: '20200101',
        colorID: '1',
        id: 'abc',
        name: 'Test',
        type: 'member/snippet',
      });
    });
  });
});
