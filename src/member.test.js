import Member from './member';

describe('Member', function () {
  const ID = 'abc123';

  it('constructs a Member instance', function () {
    const member = new Member(ID);
    expect(member instanceof Member).toBeTruthy();
  });

  describe('getters', function () {
    const ID = 'abc123';

    describe('data', function () {
      it('returns ready to use data', function () {
        const member = new Member(ID, {
          birthdate: 20000101,
          color: 1,
          gender: 'MALE',
          id: 'abc123',
          initials: 'TT',
          isHidden: true,
          isPrivate: true,
          meta: { something: true },
          name: 'Test',
          nationality: 'KOREAN',
          positions: ['DANCER', 'RAPPER'],
          primaryGenre: 'POP',
          referenceArtists: { 'abc:Test': true },
          tags: ['RAPSTAR'],
        });
        expect(member.data).toEqual({
          age: 19,
          birthdate: 20000101,
          color: 1,
          gender: 'MALE',
          id: 'abc123',
          initials: 'TT',
          isHidden: true,
          isPrivate: true,
          meta: { something: true },
          name: 'Test',
          nationality: 'KOREAN',
          positions: ['DANCER', 'RAPPER'],
          primaryGenre: 'POP',
          referenceArtistsQuery: 'test',
          referenceArtistsSnippet: [
            {
              id: 'abc',
              name: 'Test',
            },
          ],
          tags: ['RAPSTAR'],
          type: 'member',
        });
      });

      it('returns ready to use data with default values', function () {
        const member = new Member(ID, {
          name: 'Test',
          color: 1,
        });
        expect(member.data).toEqual({
          age: 0,
          birthdate: null,
          color: 1,
          gender: 'UNKNOWN',
          id: 'abc123',
          initials: 'TS',
          isHidden: false,
          isPrivate: false,
          meta: {},
          name: 'Test',
          nationality: 'UNKNOWN',
          positions: [],
          primaryGenre: 'UNKNOWN',
          referenceArtistsQuery: '',
          referenceArtistsSnippet: [],
          tags: [],
          type: 'member',
        });
      });

      it('throws errors if data is invalid', function () {
        function catcher() {
          return new Member(ID).data;
        }
        expect(catcher).toThrowError(
          "Member validation has failed: Missing required property 'name'"
        );
      });
    });

    describe('referenceArtistsSnippet', function () {
      it('builds snippet correctly', function () {
        const member = new Member(ID, {
          name: 'Test',
          color: 1,
          referenceArtists: {
            'abc:Test': true,
            'def:Bobs': true,
          },
        });
        expect(member.referenceArtistsSnippet).toEqual([
          {
            id: 'abc',
            name: 'Test',
          },
          {
            id: 'def',
            name: 'Bobs',
          },
        ]);
      });

      it('returns empty array when member does not have any reference artist', function () {
        const member = new Member(ID, {
          name: 'Test',
          color: 1,
        });
        expect(member.referenceArtistsSnippet).toEqual([]);
      });
    });

    describe('referenceArtistsQuery', function () {
      it('builds query correctly', function () {
        const member = new Member(ID, {
          name: 'Test',
          color: 1,
          referenceArtists: {
            'abc:Test': true,
            'def:Bobs': true,
          },
        });
        expect(member.referenceArtistsQuery).toEqual('testbobs');
      });

      it('returns empty string when member does not have any reference artist', function () {
        const member = new Member(ID, {
          name: 'Test',
          color: 1,
        });
        expect(member.referenceArtistsQuery).toEqual('');
      });
    });
  });

  describe('methods', function () {
    describe('validate', function () {
      it('returns true if name and color are correct', function () {
        const member = new Member(ID, { name: 'Test', color: 1 });
        expect(member.validate()).toBeTruthy();
      });

      it('throws error if name does not exist', function () {
        function catcher() {
          return new Member(ID, { color: 1 }).validate();
        }

        expect(catcher).toThrowError(
          "Member validation has failed: Missing required property 'name'"
        );
      });

      it('throws error if color does not exist', function () {
        function catcher() {
          return new Member(ID, { name: 'Test' }).validate();
        }

        expect(catcher).toThrowError(
          "Member validation has failed: Missing required property 'color'"
        );
      });

      it('throws error if genre is not part of the GENRES enum', function () {
        function catcher() {
          return new Member(ID, {
            name: 'Test',
            color: 1,
            primaryGenre: 'SOMETHING',
          }).validate();
        }

        expect(catcher).toThrowError("'SOMETHING' is not part of Enum(GENRES)");
      });

      it('throws error if gender is not part of the GENDER enum', function () {
        function catcher() {
          return new Member(ID, {
            name: 'Test',
            color: 1,
            gender: 'SOMETHING',
          }).validate();
        }

        expect(catcher).toThrowError("'SOMETHING' is not part of Enum(GENDERS)");
      });

      it('throws nationality if genre is not part of the NATIONALITIES enum', function () {
        function catcher() {
          return new Member(ID, {
            name: 'Test',
            color: 1,
            nationality: 'SOMETHING',
          }).validate();
        }

        expect(catcher).toThrowError("'SOMETHING' is not part of Enum(NATIONALITIES)");
      });
    });

    describe('deserialize', function () {
      it('works correctly with a complete set of data', function () {
        const member = new Member(ID, {
          birthdate: 20000101,
          color: 1,
          gender: 'MALE',
          id: 'abc123',
          initials: 'TT',
          isHidden: true,
          isPrivate: true,
          meta: { something: true },
          name: 'Test',
          nationality: 'KOREAN',
          positions: ['DANCER', 'RAPPER'],
          primaryGenre: 'POP',
          referenceArtists: { 'abc:Test': true },
          tags: ['RAPSTAR'],
        });
        const result = member.deserialize();
        expect(result).toEqual({
          body: {
            birthdate: 20000101,
            color: 1,
            gender: null,
            initials: 'TT',
            isHidden: true,
            isPrivate: true,
            meta: {
              something: true,
            },
            name: 'Test',
            nationality: 'KOREAN',
            positions: ['DANCER', 'RAPPER'],
            primaryGenre: 'POP',
            referenceArtists: {
              'abc:Test': true,
            },
            tags: ['RAPSTAR'],
          },
          id: 'abc123',
        });
      });

      it('works correctly omitting optional data', function () {
        const artist = new Member(ID, { name: 'Test', color: 1 });
        const result = artist.deserialize();
        expect(result).toEqual({
          body: {
            birthdate: null,
            color: 1,
            gender: null,
            initials: null,
            isHidden: null,
            isPrivate: null,
            meta: null,
            name: 'Test',
            nationality: null,
            positions: null,
            primaryGenre: null,
            referenceArtists: null,
            tags: null,
          },
          id: 'abc123',
        });
      });
    });

    describe('serialize', function () {
      let member = null;

      const testList = [
        ['id', null, '123'],
        ['name', 'Test', '123'],
        ['color', 1, 3],
        ['birthdate', null, 20000101],
        ['initials', 'TS', 'TT'],
        ['isPrivate', false, true],
        ['isHidden', false, true],
        ['positions', [], ['abc']],
        ['tags', [], ['abc']],
        ['meta', {}, { 'abc:Bobs': true }],
        ['gender', 'UNKNOWN', 'MALE'],
        ['primaryGenre', 'UNKNOWN', 'POP'],
        ['nationality', 'UNKNOWN', 'AMERICAN'],
      ];

      beforeEach(function () {
        member = new Member(null, { name: 'Test', color: 1 });
      });

      test.each(testList)('sets %s', function (property, defaultValue, value) {
        expect(member.data[property]).toEqual(defaultValue);
        expect(member.serialize({ [property]: value })[property]).toEqual(value);
      });

      it('sets referenceArtists', function () {
        expect(member.data.referenceArtistsSnippet).toEqual([]);
        expect(
          member.serialize({ referenceArtists: { 'm123:Bobs': true } }).referenceArtistsSnippet
        ).toEqual([
          {
            id: 'm123',
            name: 'Bobs',
          },
        ]);
      });
    });

    describe('addReferenceArtistUrn', function () {
      it('works correctly', function () {
        const member = new Member(ID, { name: 'Test', color: 1 });
        const result = member.addReferenceArtistUrn('abc', 'bob');
        expect(result).toEqual([{ id: 'abc', name: 'bob' }]);
      });

      it('throws an error if any parameter is missing correctly', function () {
        function catcher1() {
          return new Member(ID, {
            name: 'Test',
            color: 1,
          }).addReferenceArtistUrn();
        }

        expect(catcher1).toThrowError(
          'artistID and artistName are required to add referenceArtistUrn'
        );

        function catcher2() {
          return new Member(ID, {
            name: 'Test',
            color: 1,
          }).addReferenceArtistUrn('abc');
        }

        expect(catcher2).toThrowError(
          'artistID and artistName are required to add referenceArtistUrn'
        );

        function catcher3() {
          return new Member(ID, {
            name: 'Test',
            color: 1,
          }).addReferenceArtistUrn(undefined, 'Bobs');
        }

        expect(catcher3).toThrowError(
          'artistID and artistName are required to add referenceArtistUrn'
        );
      });
    });

    describe('addPosition', function () {
      it('works correctly', function () {
        const member = new Member(ID, { name: 'Test', color: 1 });
        const result = member.addPosition('LEAD_VOCALIST');
        expect(result).toEqual(['LEAD_VOCALIST']);
      });

      it('keeps positions list unique', function () {
        const member = new Member(ID, {
          name: 'Test',
          color: 1,
          positions: ['LEAD_VOCALIST', 'DANCER'],
        });
        let result = member.addPosition('DANCER');
        expect(result).toEqual(['DANCER', 'LEAD_VOCALIST']);
        result = member.addPosition('RAPPER');
        expect(result).toEqual(['DANCER', 'LEAD_VOCALIST', 'RAPPER']);
        result = member.addPosition('LEAD_VOCALIST');
        expect(result).toEqual(['DANCER', 'LEAD_VOCALIST', 'RAPPER']);
      });

      it('throws an error if any parameter is missing', function () {
        function catcher() {
          return new Member(ID, {
            name: 'Test',
            color: 1,
          }).addPosition();
        }

        expect(catcher).toThrowError('position is required');
      });

      describe('removePosition', function () {
        it('works correctly', function () {
          const member = new Member(ID, { name: 'Test', color: 1 });
          const result = member.removePosition('LEAD_VOCALIST');
          expect(result).toEqual([]);
        });

        it('works on multiple removes', function () {
          const member = new Member(ID, {
            name: 'Test',
            color: 1,
            positions: ['LEAD_VOCALIST', 'DANCER'],
          });
          let result = member.removePosition('DANCER');
          expect(result).toEqual(['LEAD_VOCALIST']);
          result = member.removePosition('RAPPER');
          expect(result).toEqual(['LEAD_VOCALIST']);
          result = member.removePosition('LEAD_VOCALIST');
          expect(result).toEqual([]);
        });

        it('throws an error if any parameter is missing', function () {
          function catcher() {
            return new Member(ID, {
              name: 'Test',
              color: 1,
            }).removePosition();
          }

          expect(catcher).toThrowError('position is required');
        });
      });
    });
  });
});
