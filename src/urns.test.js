import * as urns from './urns';

describe('urns', function () {
  describe('buildAlbumArtistUrn', function () {
    it('works correctly', function () {
      expect(urns.buildAlbumArtistUrn({ name: 'Test', artistID: 'abc' })).toEqual(
        'artist:Test:abc'
      );
    });

    it('works with optional artistID correctly', function () {
      expect(urns.buildAlbumArtistUrn({ name: 'Test' })).toEqual('artist:Test:');
    });

    it('throws error if name is not provided', function () {
      function catcher() {
        return urns.buildAlbumArtistUrn({});
      }

      expect(catcher).toThrowError('name is required to build an AlbumArtistUrn');
    });
  });

  describe('parseAlbumArtistUrn', function () {
    it('works correctly', function () {
      expect(urns.parseAlbumArtistUrn('artist:Test:abc')).toEqual({
        id: 'abc',
        name: 'Test',
        type: 'artist/snippet',
      });
    });
  });

  describe('buildAlbumSongUrn', function () {
    it('works correctly', function () {
      expect(urns.buildAlbumSongUrn({ title: 'Test', songID: 'abc' })).toEqual('song:Test:abc');
    });

    it('works with optional songID correctly', function () {
      expect(urns.buildAlbumSongUrn({ title: 'Test' })).toEqual('song:Test:');
    });

    it('throws error if name is not provided', function () {
      function catcher() {
        return urns.buildAlbumSongUrn({});
      }

      expect(catcher).toThrowError('title is required to build an AlbumSongUrn');
    });
  });

  describe('parseAlbumSongUrn', function () {
    it('works correctly', function () {
      expect(urns.parseAlbumSongUrn('song:Test:abc')).toEqual({
        id: 'abc',
        title: 'Test',
        type: 'song/snippet',
      });
    });
  });

  describe('buildArtistMemberUrn', function () {
    it('works correctly', function () {
      expect(
        urns.buildArtistMemberUrn({ birthdate: 20200101, id: 'abc', name: 'Test', colorID: '1' })
      ).toEqual('member:20200101:abc:Test:1');
    });

    it('throws error if birthdate is not provided', function () {
      function catcher() {
        return urns.buildArtistMemberUrn({});
      }

      expect(catcher).toThrowError('birthdate is required to build an ArtistMemberUrn');
    });

    it('throws error if id is not provided', function () {
      function catcher() {
        return urns.buildArtistMemberUrn({ birthdate: 20200101 });
      }

      expect(catcher).toThrowError('id is required to build an ArtistMemberUrn');
    });

    it('throws error if name is not provided', function () {
      function catcher() {
        return urns.buildArtistMemberUrn({ birthdate: 20200101, id: 'abc' });
      }

      expect(catcher).toThrowError('name is required to build an ArtistMemberUrn');
    });

    it('throws error if colorID is not provided', function () {
      function catcher() {
        return urns.buildArtistMemberUrn({ birthdate: 20200101, id: 'abc', name: 'Test' });
      }

      expect(catcher).toThrowError('colorID is required to build an ArtistMemberUrn');
    });
  });

  describe('parseArtistMemberUrn', function () {
    it('works correctly', function () {
      expect(urns.parseArtistMemberUrn('member:20200101:abc:Test:1')).toEqual({
        birthdate: '20200101',
        colorID: '1',
        id: 'abc',
        name: 'Test',
        type: 'member/snippet',
      });
    });
  });

  describe('buildMemberArtistUrn', function () {
    it('works correctly', function () {
      expect(urns.buildMemberArtistUrn({ name: 'Test', artistID: 'abc' })).toEqual(
        'artist:abc:Test'
      );
    });

    it('throws error if artistID is not provided', function () {
      function catcher() {
        return urns.buildMemberArtistUrn({});
      }

      expect(catcher).toThrowError('artistID is required to build an MemberArtistUrn');
    });

    it('throws error if name is not provided', function () {
      function catcher() {
        return urns.buildMemberArtistUrn({ artistID: 'abc' });
      }

      expect(catcher).toThrowError('name is required to build an MemberArtistUrn');
    });
  });

  describe('parseMemberArtistUrn', function () {
    it('works correctly', function () {
      expect(urns.parseMemberArtistUrn('artist:abc:Test')).toEqual({
        id: 'abc',
        name: 'Test',
        type: 'artist/snippet',
      });
    });
  });
});
