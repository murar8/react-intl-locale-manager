import {
  updateTranslations,
  findDuplicates,
  getEmptyKeyStats,
  getTranslationStats,
} from "./translations";

describe("updateTranslations", () => {
  const messages = [
    {
      id: "a",
      defaultMessage: "updated a",
      file: "path/file_a",
      start: { line: 10, column: 20 },
      end: { line: 10, column: 30 },
    },
    {
      id: "b",
      defaultMessage: "updated b",
      file: "path/file_b",
      start: { line: 10, column: 20 },
      end: { line: 10, column: 30 },
    },
  ];

  it("Should add new messages to tranlations.", () => {
    const actual = updateTranslations({ en: { b: "message b" } }, messages, ["en"]);
    const expected = { en: { a: "updated a", b: "message b" } };

    expect(actual).toEqual(expected);
  });

  it("Should remove superfluous messages.", () => {
    const actual = updateTranslations({ en: { b: "message b" } }, messages.slice(0, 1), ["en"]);
    const expected = { en: { a: "updated a" } };

    expect(actual).toEqual(expected);
  });

  it("Should NOT overwrite the translations' messages.", () => {
    const actual = updateTranslations({ en: { a: "message a" } }, messages, ["en"]);
    const expected = { en: { a: "message a", b: "updated b" } };

    expect(actual).toEqual(expected);
  });

  it("Should add a translation entry for every new locale.", () => {
    const actual = updateTranslations({ en: { a: "message a" } }, messages.slice(0, 1), [
      "en",
      "es",
      "de",
    ]);

    const expected = { en: { a: "message a" }, es: { a: "updated a" }, de: { a: "updated a" } };

    expect(actual).toEqual(expected);
  });

  it("Should remove superfluous translations.", () => {
    const actual = updateTranslations(
      { en: { a: "message a" }, de: { a: "message a" } },
      messages.slice(0, 1),
      ["en"]
    );

    const expected = { en: { a: "message a" } };

    expect(actual).toEqual(expected);
  });
});

describe("findDuplicates", () => {
  it("Should return the location of duplicated messages.", () => {
    const messages = [
      {
        id: "a",
        defaultMessage: "message a",
        file: "path/file_a",
        start: { line: 10, column: 20 },
        end: { line: 10, column: 30 },
      },
      {
        id: "b",
        defaultMessage: "message b",
        file: "path/file_b",
        start: { line: 10, column: 20 },
        end: { line: 10, column: 30 },
      },
      {
        id: "b",
        defaultMessage: "other b",
        file: "path/file_c",
        start: { line: 15, column: 30 },
        end: { line: 25, column: 10 },
      },
    ];

    const expected = {
      b: [
        { file: "path/file_b", line: 10, column: 20 },
        { file: "path/file_c", line: 15, column: 30 },
      ],
    };

    expect(findDuplicates(messages)).toEqual(expected);
    expect(findDuplicates([])).toEqual({});
    expect(findDuplicates(messages.slice(-1))).toEqual({});
  });
});

describe("getEmptyKeysCount", () => {
  it("Should return the added language codes.", () => {
    expect(getEmptyKeyStats({})).toEqual({ emptyCountByLocale: {}, emptyCountTotal: 0 });
    expect(getEmptyKeyStats({ en: { a: "1" } })).toEqual({
      emptyCountByLocale: {},
      emptyCountTotal: 0,
    });
    expect(
      getEmptyKeyStats({ en: { a: "1", b: "" }, it: { a: "" }, de: { a: "2", b: "3" } })
    ).toEqual({ emptyCountByLocale: { en: 1, it: 1 }, emptyCountTotal: 2 });
  });
});

describe("getTranslationStats", () => {
  it("Should return statistics about the translations.", () => {
    expect(
      getTranslationStats(
        { en: { a: "1", b: "2" }, es: { a: "1", b: "2" }, hk: { f: "0", a: "1", b: "2" } },
        {
          en: { b: "2", c: "3", d: "4" },
          de: { b: "2", c: "3", d: "4" },
          nl: { b: "2", c: "3", d: "4" },
        }
      )
    ).toEqual({
      addedIds: ["c", "d"],
      removedIds: ["a", "f"],
      addedLocales: ["de", "nl"],
      removedLocales: ["es", "hk"],
    });
  });
});
