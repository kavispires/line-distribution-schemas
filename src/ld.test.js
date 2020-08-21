import LD from './ld';

describe('LD', function () {
  const ID = 'abc123';

  it('constructs a LD instance', function () {
    const ld = new LD(ID, 'sample');
    expect(ld instanceof LD).toBeTruthy();
  });

  it('throws error if it is initiated without a type', function () {
    function catcher() {
      return new LD(ID);
    }

    expect(catcher).toThrowError('You must assign a type');
  });

  describe('getters', function () {
    describe('isValid', function () {
      it('returns true when validation passes', function () {
        const ld = new LD(ID, 'sample');
        expect(ld.isValid).toBeTruthy();
      });

      it('returns false when validation passes', function () {
        const ld = new LD(ID, 'sample');
        ld.types = { property: 'string' };
        expect(ld.isValid).toBeFalsy();
      });
    });

    describe('_capitalizedType', function () {
      it('returns the a capitalized type correctly', function () {
        const ld = new LD(ID, 'sample');
        expect(ld._capitalizedType()).toEqual('Sample');
      });
    });
  });

  describe('setters', function () {
    describe('set id', function () {
      it('returns true when validation passes', function () {
        const ld = new LD(ID, 'sample');
        expect(ld._id).toEqual(ID);
        ld.id = 'DEF';
        expect(ld._id).toEqual('DEF');
      });
    });
  });

  describe('methods', function () {
    describe('validateID', function () {
      it('returns true if ID exists', function () {
        const ld = new LD(ID, 'sample');
        expect(ld.validateID()).toBeTruthy();
      });

      it('throws error if ID does not exist', function () {
        function catcher() {
          return new LD(null, 'sample').validateID();
        }

        expect(catcher).toThrowError('Failed to validate Sample ID');
      });
    });

    describe('validateType', function () {
      it('returns true if type matches', function () {
        const ld = new LD(ID, 'sample');
        expect(ld.validateType({ type: 'sample' })).toBeTruthy();
      });

      it('throws error if ID does not exist', function () {
        function catcher() {
          return new LD(ID, 'sample').validateType({ type: 'something' });
        }

        expect(catcher).toThrowError(
          "Failed to validate type. Expected 'sample', instead got 'something'"
        );
      });
    });

    describe('validate', function () {
      it('returns true if all types are correct', function () {
        const ld = new LD(ID, 'sample');
        ld.types = { _value: 'string' };
        ld._value = 'abc';
        expect(ld.validate()).toBeTruthy();
      });

      it('throws error if property does not exist', function () {
        function catcher() {
          const ld = new LD(ID, 'sample');
          ld.types = { _value: 'string' };
          return ld.validate();
        }

        expect(catcher).toThrowError(
          "Sample validation has failed: Missing required property 'value'"
        );
      });
    });
  });
});
