import Collection from './collection';
import Artist from './artist';

describe('Collection', function () {
  // const ID = 'abc123';

  it('constructs a Collection instance', function () {
    const collection = new Collection('lds', Artist);
    expect(collection instanceof Collection).toBeTruthy();
  });

  it('throws error if it is initiated without a collection name', function () {
    function catcher() {
      return new Collection();
    }

    expect(catcher).toThrowError(
      'You must assign a collection name, usually the pluralized library class name'
    );
  });

  it('throws error if it is initiated without a library name', function () {
    function catcher() {
      return new Collection('artists');
    }

    expect(catcher).toThrowError('You must assign a library class');
  });

  describe('getters', function () {
    let collection;

    beforeEach(function () {
      collection = new Collection('artists', Artist, [
        { id: 'abc', name: 'Test', debutYear: 2000 },
      ]);
    });

    describe('records', function () {
      it('returns the list of records', function () {
        expect(Array.isArray(collection.records)).toBeTruthy();
        expect(collection.records.length).toEqual(1);
        expect(collection.records[0] instanceof Artist);
      });
    });

    describe('recordsDict', function () {
      it('returns the dictionary of records', function () {
        expect(typeof collection.recordsDict).toEqual('object');
        expect(collection.records['abc'] instanceof Artist);
      });
    });

    describe('isDirty', function () {
      it('check if collection has been modified', function () {
        expect(collection.isDirty).toBeFalsy();

        collection._lastUpdatedAt = 1;

        expect(collection.isDirty).toBeTruthy();
      });
    });

    describe('types', function () {
      it('get the object list of types for the collections class', function () {
        expect(collection.types).toEqual({
          _agency: 'string:optional',
          _debutYear: 'number',
          _disbandmentYear: 'number:optional',
          _genre: 'Enum:GENRES',
          _isPrivate: 'boolean:optional',
          _isSoloist: 'boolean:optional',
          _memberUrns: 'array:optional',
          _name: 'string',
          _otherNames: 'string:optional',
          _unit_ids: 'array:optional',
        });
      });
    });
  });

  describe('methods', function () {
    let collection;

    beforeEach(function () {
      collection = new Collection('artists', Artist, [
        { id: 'abc', name: 'Test', isPrivate: true, debutYear: 2000 },
      ]);
    });

    describe('addRecord', function () {
      it('adds record correctly', function () {
        expect(collection.addRecord('bcd', { name: 'Test', debutYear: 2000 }) instanceof Artist)
          .toBeTruthy;
        expect(collection.records.length).toEqual(2);
      });
    });

    describe('updateRecord', function () {
      it('updates record correctly', function () {
        expect((collection.recordsDict['abc'].data.name = 'Test'));
        expect((collection.recordsDict['abc'].data.isPrivate = true));
        collection.updateRecord('abc', { name: 'Bola' });
        expect((collection.recordsDict['abc'].data.name = 'Bola'));
        expect((collection.recordsDict['abc'].data.isPrivate = true));
      });
    });

    describe('replaceRecord', function () {
      it('replaces record correctly', function () {
        expect((collection.recordsDict['abc'].data.name = 'Test'));
        expect((collection.recordsDict['abc'].data.isPrivate = true));
        collection.updateRecord('abc', { name: 'Bola' });
        expect((collection.recordsDict['abc'].data.name = 'Bola'));
        expect((collection.recordsDict['abc'].data.isPrivate = false));
      });
    });

    describe('removeRecord', function () {
      it('removes record correctly', function () {
        collection.removeRecord('abc');
        expect(collection.records.length).toEqual(0);
      });
    });

    describe('findByID', function () {
      it('finds a record correctly', function () {
        const response = collection.findByID('abc');
        expect(response instanceof Artist).toBeTruthy();
      });

      it('throws error if record cannot be found', function () {
        function catcher() {
          collection.findByID('ijk');
        }

        expect(catcher).toThrowError('Failed to find record of id ijk in artists');
      });
    });

    describe('refresh', function () {
      it('refreshes collection correctly', function () {
        expect(collection.isDirty).toBeFalsy;

        collection._lastUpdatedAt = 1;

        expect(collection.isDirty).toBeTruthy;

        collection.refresh();

        expect(collection.isDirty).toBeFalsy;
      });

      describe('reset', function () {
        it('resets collection correctly', function () {
          collection.addRecord('bcd', { name: 'Test', debutYear: 2000 });
          expect(collection.isDirty).toBeTruthy;
          expect(collection.records.length).toEqual(2);

          collection.reset();

          expect(collection.isDirty).toBeFalsy;
          expect(collection.records.length).toEqual(0);
        });
      });
    });
  });
});
