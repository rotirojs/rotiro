import { areListsEqual, extractStringArrayFromText } from "./arrays";

describe("arrays", () => {
  describe("extractStringArrayFromText", () => {
    it("Should split text wrapped with []", () => {
      const result = extractStringArrayFromText("[test,case]");
      expect(result).toEqual(["test", "case"]);
    });

    it("Should split text seperated by commas", () => {
      const result = extractStringArrayFromText("test,case");
      expect(result).toEqual(["test", "case"]);
    });

    it("Should return a single value as array", () => {
      const result = extractStringArrayFromText("test");
      expect(result).toEqual(["test"]);
    });

    it("Should return empty string as empty array", () => {
      const result = extractStringArrayFromText("");
      expect(result).toEqual([]);
    });

    it("Should return empty [] as empty array", () => {
      const result = extractStringArrayFromText("[]");
      expect(result).toEqual([]);
    });
  });

  describe("areListsEqual", () => {
    it("Should return false if 1 empty and 1 is not", () => {
      expect(areListsEqual([], ["2"])).toEqual(false);
    });

    it("Should return true if both empty", () => {
      expect(areListsEqual([], [])).toEqual(true);
    });

    it("Should return true if both contain the same elements", () => {
      expect(areListsEqual(["3", "4", "7"], ["7", "3", "4"])).toEqual(true);
    });

    it("Should return false if both contain different elements", () => {
      expect(areListsEqual(["3", "4", "7"], ["3", "5", "7"])).toEqual(false);
    });
  });
});
