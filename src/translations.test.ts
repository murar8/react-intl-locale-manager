import {
  updateTranslations,
  findDuplicates,
  getAddedIds,
  getRemovedIds,
  getAddedLanguages,
  getRemovedLanguages,
  getEmptyKeysCount,
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

describe("getAddedIds", () => {
  it("Should return the added ids.", () => {
    const current: any = {
      en: { a: "message a", b: "message b", c: "message c" },
      it: { a: "message a", b: "message b" },
    };

    const next: any = {
      en: { a: "message a", b: "message b", c: "message c", d: "message d" },
      it: { a: "message a", b: "message b", c: "message c", d: "message d" },
    };

    expect(getAddedIds({}, {})).toEqual([]);
    expect(getAddedIds(next, next)).toEqual([]);
    expect(getAddedIds(current, next)).toEqual(["c", "d"]);
  });
});

describe("getRemovedIds", () => {
  it("Should return the removed ids.", () => {
    const current: any = {
      en: { a: "message a", b: "message b", c: "message c", d: "message d" },
      it: { a: "message a", b: "message b" },
    };

    const next: any = {
      en: { a: "message a", b: "message b" },
      it: { a: "message a", b: "message b" },
    };

    expect(getRemovedIds({}, {})).toEqual([]);
    expect(getRemovedIds(next, next)).toEqual([]);
    expect(getRemovedIds(current, next)).toEqual(["c", "d"]);
  });
});

describe("getAddedLanguages", () => {
  it("Should return the added language codes.", () => {
    expect(getAddedLanguages({}, {})).toEqual([]);
    expect(getAddedLanguages({ en: {} }, { en: {}, it: {}, de: {} })).toEqual(["it", "de"]);
  });
});

describe("getRemovedLanguages", () => {
  it("Should return the added language codes.", () => {
    expect(getRemovedLanguages({}, {})).toEqual([]);
    expect(getRemovedLanguages({ en: {}, it: {}, de: {} }, { en: {} })).toEqual(["it", "de"]);
  });
});

describe("getEmptyKeysCount", () => {
  it("Should return the added language codes.", () => {
    expect(getEmptyKeysCount({})).toEqual({});
    expect(getEmptyKeysCount({ en: { a: "1" } })).toEqual({});
    expect(
      getEmptyKeysCount({ en: { a: "1", b: "" }, it: { a: "" }, de: { a: "2", b: "3" } })
    ).toEqual({ en: 1, it: 1 });
  });
});
