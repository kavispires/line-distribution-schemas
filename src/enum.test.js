import Enum from "./enum";

describe("Enum", function () {
  let subject = null;

  beforeEach(function () {
    subject = new Enum();
  });

  it("constructs an Enum instance", function () {
    expect(subject instanceof Enum).toBeTruthy();
  });

  describe("validate()", function () {
    it("validates existing types", function () {
      expect(subject.validate("GENDERS", "FEMALE")).toBe(true);
      expect(subject.validate("GENRES", "KPOP")).toBe(true);
      expect(subject.validate("NATIONALITIES", "KOREAN")).toBe(true);
      expect(subject.validate("NATIONALITIES", "TAIWANESE")).toBe(true);
    });

    it("validates existing types with UNKNOWN fallback", function () {
      expect(subject.validate("GENDERS", "UNKNOWN")).toBe(true);
      expect(subject.validate("GENDERS", "UNKNOWN")).toBe(true);
      expect(subject.validate("NATIONALITIES", "UNKNOWN")).toBe(true);
    });

    it("throws an error for invalid type", function () {
      function catcher() {
        subject.validate("BLAH", "blah");
      }

      expect(catcher).toThrowError("Invalid Enum type 'BLAH'");
    });

    it("throws an error for missing type", function () {
      function catcher() {
        subject.validate(undefined, "blah");
      }

      expect(catcher).toThrowError("Invalid Enum type 'undefined'");
    });

    it("throws an error for invalid value", function () {
      function catcher() {
        subject.validate("GENDERS", "blah");
      }

      expect(catcher).toThrowError("'blah' is not part of Enum(GENDERS)");
    });

    it("throws an error for missing value", function () {
      function catcher() {
        subject.validate("GENDERS");
      }

      expect(catcher).toThrowError("'undefined' is not part of Enum(GENDERS)");
    });
  });

  describe("list()", function () {
    it("returns list of values of GENDERS type correctly", function () {
      expect(subject.list("GENDERS")).toEqual(["FEMALE", "MALE", "UNKNOWN"]);
    });

    it("returns list of values of GENRES type correctly", function () {
      expect(subject.list("GENRES")).toEqual([
        "CPOP",
        "JPOP",
        "KPOP",
        "OTHER",
        "POP",
        "UNKNOWN",
      ]);
    });

    it("returns list of values of NATIONALITIES type correctly", function () {
      expect(subject.list("NATIONALITIES")).toEqual([
        "AMERICAN",
        "BRAZILIAN",
        "BRITISH",
        "CANADIAN",
        "CHINESE",
        "INDIAN",
        "INDONESIAN",
        "FILIPINO",
        "JAPANESE",
        "KOREAN",
        "OTHER",
        "TAIWANESE",
        "THAI",
        "VIETNAMESE",
        "PLANTIAN",
        "UNKNOWN",
      ]);
    });

    it("throws an error for invalid types", function () {
      function catcher() {
        subject.list("BLAH");
      }

      expect(catcher).toThrowError("Invalid Enum type 'BLAH'");
    });
  });
});
