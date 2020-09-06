import { typeCheck } from './type-check';

describe('type-check', function () {
  it('checks a string correctly', function () {
    const context = { foo: 'abc' };
    const types = { foo: 'string' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('checks a number correctly', function () {
    const context = { foo: 123 };
    const types = { foo: 'number' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('checks a boolean correctly', function () {
    const context = { foo: false };
    const types = { foo: 'boolean' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('checks an object correctly', function () {
    const context = { foo: {} };
    const types = { foo: 'object' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('checks an array correctly', function () {
    const context = { foo: ['abc'] };
    const types = { foo: 'array' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('checks an Enum correctly', function () {
    const context = { foo: 'POP' };
    const types = { foo: 'Enum:GENRES' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('checks a Date number correctly', function () {
    const context = { foo: 20000101 };
    const types = { foo: 'Date' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('checks a Year number correctly', function () {
    const context = { foo: 2000 };
    const types = { foo: 'Year' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('checks multiple properties at once correctly', function () {
    const context = { foo: 'abc', bar: 123, biz: true };
    const types = { foo: 'string', bar: 'number', biz: 'boolean' };
    expect(typeCheck(context, types)).toBeTruthy();
  });

  it('throws error if value is required and not present', function () {
    function catcher() {
      const context = {};
      const types = { foo: 'string' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError("Missing required property 'foo'");
  });

  it('throws error if string type is not correct', function () {
    function catcher() {
      const context = { foo: 123 };
      const types = { foo: 'string' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError('Expected foo to be a string, instead got number');
  });

  it('throws error if number type is not correct', function () {
    function catcher() {
      const context = { foo: 'abc' };
      const types = { foo: 'number' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError('Expected foo to be a number, instead got string');
  });

  it('throws error if boolean type is not correct', function () {
    function catcher() {
      const context = { foo: 'abc' };
      const types = { foo: 'boolean' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError('Expected foo to be a boolean, instead got string');
  });

  it('throws error if object type is not correct', function () {
    function catcher() {
      const context = { foo: 'abc' };
      const types = { foo: 'object' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError('Expected foo to be a object, instead got string');
  });

  it('throws error if array type is not correct', function () {
    function catcher() {
      const context = { foo: 'abc' };
      const types = { foo: 'array' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError('Expected foo to be an array, instead got string');
  });

  it('throws error if enum type is not correct', function () {
    function catcher() {
      const context = { foo: 'abc' };
      const types = { foo: 'Enum:GENDERS' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError("'abc' is not part of Enum(GENDERS)");
  });

  it('throws error if enum group is not correct', function () {
    function catcher() {
      const context = { foo: 'POP' };
      const types = { foo: 'Enum:GENDERS' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError("'POP' is not part of Enum(GENDERS)");
  });

  it('throws error if Date is not a number', function () {
    function catcher() {
      const context = { foo: '20000101' };
      const types = { foo: 'Date' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError(
      'Expected foo to be a date number format YYYYMMDD, instead got string'
    );
  });

  it('throws error if Date is not formatted correctly', function () {
    function catcher() {
      const context = { foo: 20000 };
      const types = { foo: 'Date' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError(
      'Expected foo to be a date number format YYYYMMDD, instead got 20000'
    );
  });

  it('throws error if Year is not a number', function () {
    function catcher() {
      const context = { foo: '20000101' };
      const types = { foo: 'Year' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError(
      'Expected foo to be a year number format YYYY, instead got string'
    );
  });

  it('throws error if Year is not formatted correctly', function () {
    function catcher() {
      const context = { foo: 20000 };
      const types = { foo: 'Year' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError('Expected foo to be a year number format YYYY, instead got 20000');
  });

  it('throws error if the Date is not correct', function () {
    function catcher() {
      const context = { foo: 20201373 };
      const types = { foo: 'Date' };
      typeCheck(context, types);
    }

    expect(catcher).toThrowError(
      'Expected foo to be a date with format YYYYMMDD, instead got 20201373'
    );
  });

  it('validates as correct when type is optional', function () {
    const context = {};
    const types = { foo: 'string:optional' };
    typeCheck(context, types);

    expect(typeCheck(context, types)).toBeTruthy();
  });
});
