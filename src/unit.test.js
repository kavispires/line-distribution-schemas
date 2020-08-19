import Unit from "./unit";

describe("Unit", function () {
  const ID = "abc123";

  it("constructs a Unit instance", function () {
    const unit = new Unit(ID);
    expect(unit instanceof Unit).toBeTruthy();
  });

  describe("getters", function () {
    const ID = "abc123";

    describe("data", function () {
      it("returns ready to use data", function () {
        const unit = new Unit(ID, {
          albumIDs: ["zxc098"],
          artistID: "abc123",
          debutYear: 20000101,
          distributionIDs: ["cde456"],
          id: ID,
          isPrivate: true,
          isCustom: true,
          kind: "SPECIAL",
          name: "Test",
          membersPositionHash: { "m123:Bob:VOCALIST": "LEAD" },
          membersStatsHash: { m123: "13:67:35" },
        });

        expect(unit.data).toEqual({
          albumIDs: ["zxc098"],
          artistID: "abc123",
          debutYear: 20000101,
          distributionIDs: ["cde456"],
          id: ID,
          isPrivate: true,
          isCustom: true,
          kind: "SPECIAL",
          membersSnippet: [
            {
              id: "m123",
              name: "Bob",
              positions: ["LEAD_VOCALIST"],
              stats: {
                custom: 67,
                official: 13,
                total: 35,
              },
            },
          ],
          name: "Test",
          type: "unit",
        });
      });

      it("returns ready to use data with default values", function () {
        const unit = new Unit(ID, { name: "Test", debutYear: 20000101 });

        expect(unit.data).toEqual({
          albumIDs: [],
          artistID: null,
          debutYear: 20000101,
          distributionIDs: [],
          id: ID,
          isPrivate: false,
          isCustom: false,
          kind: "NA",
          membersSnippet: [],
          name: "Test",
          type: "unit",
        });
      });

      it("throws errors if data is invalid", function () {
        function catcher() {
          return new Unit(ID).data;
        }
        expect(catcher).toThrowError(
          "Unit validation has failed: Missing required property 'name'"
        );
      });
    });

    describe("memberIDs", function () {
      it("returns the memberIDs correctly", function () {
        const unit = new Unit(ID, {
          name: "Test",
          debutYear: 20000101,
          membersPositionHash: { "m123:Bob:VOCALIST": "LEAD" },
          membersStatsHash: { m123: "13:67:35" },
        });
        expect(unit.memberIDs).toEqual(["m123"]);
      });

      it("returns the memberIDs correctly with only membersPositionHash", function () {
        const unit = new Unit(ID, {
          name: "Test",
          debutYear: 20000101,
          membersPositionHash: { "m123:Bob:VOCALIST": "LEAD" },
        });
        expect(unit.memberIDs).toEqual(["m123"]);
      });

      it("returns the memberIDs correctly with only membersStatsHash", function () {
        const unit = new Unit(ID, {
          name: "Test",
          debutYear: 20000101,
          membersStatsHash: { m124: "13:67:35" },
        });
        expect(unit.memberIDs).toEqual(["m124"]);
      });
    });
  });

  describe("methods", function () {
    describe("validate", function () {
      it("returns true if name and debutYear are correct", function () {
        const unit = new Unit(ID, { name: "Test", debutYear: 20000101 });
        expect(unit.validate()).toBeTruthy();
      });

      it("throws error if name does not exist", function () {
        function catcher() {
          return new Unit(ID, { debutYear: 20000101 }).validate();
        }

        expect(catcher).toThrowError(
          "Unit validation has failed: Missing required property 'name'"
        );
      });

      it("throws error if debutYear does not exist", function () {
        function catcher() {
          return new Unit(ID, { name: "Test" }).validate();
        }

        expect(catcher).toThrowError(
          "Unit validation has failed: Missing required property 'debutYear'"
        );
      });

      it("throws error if kind is not part of the UNITS enum", function () {
        function catcher() {
          return new Unit(ID, {
            name: "Test",
            debutYear: 20000101,
            kind: "SOMETHING",
          }).validate();
        }

        expect(catcher).toThrowError("'SOMETHING' is not part of Enum(UNITS)");
      });
    });

    describe("deserialize", function () {
      it("works correctly with a complete set of data", function () {
        const unit = new Unit(ID, {
          albumIDs: ["zxc098"],
          artistID: "abc123",
          debutYear: 20000101,
          distributionIDs: ["cde456"],
          id: ID,
          isPrivate: true,
          isCustom: true,
          kind: "CUSTOM",
          name: "Test",
          membersPositionHash: { "m123:Bob:VOCALIST": "LEAD" },
          membersStatsHash: { m123: "13:67:35" },
        });
        const result = unit.deserialize();
        expect(result).toEqual({
          body: {
            albumIDs: ["zxc098"],
            artistID: "abc123",
            debutYear: 20000101,
            distributionIDs: ["cde456"],
            isPrivate: true,
            isCustom: true,
            kind: "CUSTOM",
            membersPositionHash: { "m123:Bob:VOCALIST": "LEAD" },
            membersStatsHash: { m123: "13:67:35" },
            name: "Test",
          },
          id: "abc123",
        });
      });

      it("works correctly omitting optional data", function () {
        const artist = new Unit(ID, { name: "Test", debutYear: 20000101 });
        const result = artist.deserialize();
        expect(result).toEqual({
          body: {
            albumIDs: null,
            artistID: null,
            debutYear: 20000101,
            distributionIDs: null,
            isPrivate: null,
            isCustom: null,
            kind: null,
            membersPositionHash: null,
            membersStatsHash: null,
            name: "Test",
          },
          id: "abc123",
        });
      });
    });

    describe("serialize", function () {
      let unit = null;

      const testList = [
        ["id", null, "123"],
        ["name", "Test", "123"],
        ["debutYear", 20000101, 20000102],
        ["isPrivate", false, true],
        ["artistID", null, "abc"],
        ["albumIDs", [], ["abc"]],
        ["distributionIDs", [], ["abc"]],
      ];

      beforeEach(function () {
        unit = new Unit(null, { name: "Test", debutYear: 20000101 });
      });

      test.each(testList)("sets %s", function (property, defaultValue, value) {
        expect(unit.data[property]).toEqual(defaultValue);
        expect(unit.serialize({ [property]: value })[property]).toEqual(value);
      });

      it("sets membersPositionHash", function () {
        expect(unit.data.membersSnippet).toEqual([]);
        expect(
          unit.serialize({ membersPositionHash: { "m123:Bob:CENTER": true } })
            .membersSnippet
        ).toEqual([
          {
            id: "m123",
            name: "Bob",
            positions: ["CENTER"],
          },
        ]);
      });

      it("sets membersStatsHash", function () {
        expect(unit.data.membersSnippet).toEqual([]);
        expect(
          unit.serialize({ membersStatsHash: { m123: "13:67:35" } })
            .membersSnippet
        ).toEqual([
          {
            id: "m123",
            stats: {
              custom: 67,
              official: 13,
              total: 35,
            },
          },
        ]);
      });
    });
  });
});
