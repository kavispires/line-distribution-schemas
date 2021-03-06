import Artist from './artist';

describe('Artist', function () {
  const ID = 'abc123';

  it('constructs an Artist instance', function () {
    const artist = new Artist('ID');
    expect(artist instanceof Artist).toBeTruthy();
  });

  describe('getters', function () {
    describe('data', function () {
      it('returns ready to use data', function () {
        const artist = new Artist('abc345', {
          name: 'Test',
          agency: 'def',
          otherNames: 'ghi',
          debutYear: 2000,
          disbandmentYear: 2010,
          isPrivate: true,
          isSoloist: true,
          unitIDs: ['def678'],
          genres: 'KPOP',
          memberUrns: ['member:20000101:ghi890:Bob:1'],
        });

        expect(artist.data).toEqual({
          agency: 'def',
          genre: 'UNKNOWN',
          id: 'abc345',
          debutYear: 2000,
          disbandmentYear: 2010,
          isDisbanded: true,
          isPrivate: true,
          isSoloist: true,
          membersSnippet: [
            {
              birthdate: '20000101',
              colorID: '1',
              id: 'ghi890',
              name: 'Bob',
              type: 'member/snippet',
            },
          ],
          name: 'Test',
          otherNames: 'ghi',
          type: 'artist',
          unitIDs: ['def678'],
        });
      });

      it('returns ready to use data with default values', function () {
        const artist = new Artist(ID, { name: 'Test', debutYear: 2000 });

        expect(artist.data).toEqual({
          agency: 'UNKNOWN',
          genre: 'UNKNOWN',
          id: 'abc123',
          debutYear: 2000,
          disbandmentYear: null,
          isDisbanded: false,
          isPrivate: false,
          isSoloist: false,
          membersSnippet: [],
          name: 'Test',
          otherNames: '',
          type: 'artist',
          unitIDs: [],
        });
      });

      it('throws errors if data is invalid', function () {
        function catcher() {
          return new Artist(ID).data;
        }
        expect(catcher).toThrowError(
          "Artist validation has failed: Missing required property 'name'"
        );
      });
    });

    describe('membersSnippet', function () {
      it('returns the membersSnippet correctly', function () {
        const artist = new Artist(ID, {
          name: 'Test',
          debutYear: 2000,
          memberUrns: ['member:20000101:ghi890:Bob:1'],
        });
        const result = artist.membersSnippet;
        expect(Array.isArray(result)).toBeTruthy();
        expect(result[0]).toEqual({
          birthdate: '20000101',
          colorID: '1',
          id: 'ghi890',
          name: 'Bob',
          type: 'member/snippet',
        });
      });
    });

    describe('isDisbanded', function () {
      it('returns true if disbandmentYear is present', function () {
        const artist = new Artist(ID, {
          name: 'Test',
          debutYear: 2000,
          disbandmentYear: 2010,
        });

        expect(artist.isDisbanded).toBeTruthy();
      });

      it('returns false if disbandmentYear is present', function () {
        const artist = new Artist(ID, {
          name: 'Test',
          debutYear: 2000,
        });

        expect(artist.isDisbanded).toBeFalsy();
      });
    });

    describe('query', function () {
      it('returns the query correctly', function () {
        const artist = new Artist(ID, {
          name: 'Test',
          debutYear: 2000,
          agency: 'def',
          otherNames: 'ghi',
          isPrivate: true,
          isDisbanded: true,
          isSoloist: true,
          unitIDs: ['def678'],
          genres: 'KPOP',
          memberUrns: ['member:20000101:ghi890:Bob:1'],
        });
        expect(artist.query).toEqual('test ghi bob def');
      });
    });

    describe('relationships', function () {
      it('returns the relationships correctly', function () {
        const artist = new Artist('abc345', {
          name: 'Test',
          debutYear: 2000,
          agency: 'def',
          otherNames: 'ghi',
          isPrivate: true,
          isDisbanded: true,
          isSoloist: true,
          unitIDs: ['def678'],
          genres: 'KPOP',
          memberUrns: ['member:20000101:ghi890:Bob:1'],
        });

        expect(artist.relationships).toEqual({
          members: { data: [{ id: 'ghi890', type: 'member' }] },
          units: { data: [{ id: 'def678', type: 'unit' }] },
        });
      });
    });

    describe('typeahead', function () {
      it('returns the typeahead correctly', function () {
        const artist = new Artist(ID, {
          name: 'Test',
          debutYear: 2000,
          agency: 'def',
          otherNames: 'ghi',
          isPrivate: true,
          isDisbanded: true,
          isSoloist: true,
          unitIDs: ['def678'],
          genres: 'KPOP',
          memberUrns: ['member:20000101:ghi890:Bob:1'],
        });
        expect(artist.typeahead).toEqual({
          query: 'test ghi bob def',
          text: 'Test',
          value: 'abc123',
        });
      });
    });
  });

  describe('methods', function () {
    describe('validate', function () {
      it('returns true if name, debutYear, and genre are correct', function () {
        const artist = new Artist(ID, { name: 'Test', debutYear: 2000, genre: 'KPOP' });
        expect(artist.validate()).toBeTruthy();
      });

      it('throws error if name does not exist', function () {
        function catcher() {
          return new Artist(ID).validate();
        }

        expect(catcher).toThrowError(
          "Artist validation has failed: Missing required property 'name'"
        );
      });

      it('throws error if debutYear does not exist', function () {
        function catcher() {
          return new Artist(ID, { name: 'Test' }).validate();
        }

        expect(catcher).toThrowError(
          "Artist validation has failed: Missing required property 'debutYear'"
        );
      });

      it('throws error if genre is not part of the GENRES enum', function () {
        function catcher() {
          return new Artist(ID, { name: 'Test', debutYear: 2000, genre: 'MARIACHI' }).validate();
        }

        expect(catcher).toThrowError("'MARIACHI' is not part of Enum(GENRES)");
      });
    });

    describe('deserialize', function () {
      it('works correctly with a complete set of data', function () {
        const artist = new Artist(ID, {
          agency: 'Test',
          genre: 'POP',
          debutYear: 2000,
          disbandmentYear: 2010,
          isPrivate: true,
          isSoloist: true,
          memberUrns: ['2b'],
          name: 'Test',
          otherNames: 'Txt',
          unitIDs: ['1a'],
        });
        const result = artist.deserialize();
        expect(result).toEqual({
          body: {
            agency: 'Test',
            genre: 'POP',
            isPrivate: true,
            debutYear: 2000,
            disbandmentYear: 2010,
            isSoloist: true,
            memberUrns: ['2b'],
            name: 'Test',
            otherNames: 'Txt',
            unitIDs: ['1a'],
          },
          id: 'abc123',
        });
      });

      it('works correctly omitting optional data', function () {
        const artist = new Artist(ID, { name: 'Test', debutYear: 2000 });
        const result = artist.deserialize();
        expect(result).toEqual({
          body: {
            agency: null,
            genre: null,
            debutYear: 2000,
            disbandmentYear: null,
            isPrivate: null,
            isSoloist: null,
            memberUrns: null,
            name: 'Test',
            otherNames: null,
            unitIDs: null,
          },
          id: 'abc123',
        });
      });
    });

    describe('serialize', function () {
      let artist = null;

      const testList = [
        ['id', null, '123'],
        ['name', 'Test', '123'],
        ['agency', 'UNKNOWN', 'Test'],
        ['otherNames', '', ''],
        ['debutYear', 2000, 2010],
        ['disbandmentYear', null, 2010],
        ['isSoloist', false, true],
        ['unitIDs', [], ['abc']],
        ['genre', 'UNKNOWN', 'KPOP'],
      ];

      beforeEach(function () {
        artist = new Artist(null, { name: 'Test', debutYear: 2000 });
      });

      test.each(testList)('sets %s', function (property, defaultValue, value) {
        expect(artist.data[property]).toEqual(defaultValue);
        expect(artist.serialize({ [property]: value })[property]).toEqual(value);
      });

      it('sets memberUrns', function () {
        expect(artist.data.membersSnippet).toEqual([]);
        expect(
          artist.serialize({ memberUrns: ['member:20000101:ghi890:Bob:1'] }).membersSnippet
        ).toEqual([
          {
            birthdate: '20000101',
            colorID: '1',
            id: 'ghi890',
            name: 'Bob',
            type: 'member/snippet',
          },
        ]);
      });
    });

    describe('memberUrn', function () {
      it('adds member urn correctly', function () {
        const artist = new Artist(ID);
        const result = artist.connectMember({
          birthdate: '20200101',
          id: 'abc567',
          name: 'Bob',
          color: '12',
        });
        expect(result).toEqual([
          {
            birthdate: '20200101',
            colorID: '12',
            id: 'abc567',
            name: 'Bob',
            type: 'member/snippet',
          },
        ]);
      });
    });
  });
});
