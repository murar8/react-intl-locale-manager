import { createManageCommand, ManageCommandArgs, prettyStats } from "./manage";

describe("createManageCommand", () => {
  it("Should pass all the command line arguments to the callback function.", () => {
    const args = `node
                intl-extract
                -i src/*.test.js
                -i src/*.test.ts
                -l en,jp 
                -o locales
                --module-source-name intl
                --additional-component-names One,Two
                --extract-from-format-message-call
                src/*.js src/*.ts`;

    const argv = args.split(/\s+/);

    const want: ManageCommandArgs = {
      files: ["src/*.js", "src/*.ts"],
      ignore: ["src/*.test.js", "src/*.test.ts"],
      languages: ["en", "jp"],
      outMode: "directory",
      outPath: "locales",
      moduleSourceName: "intl",
      additionalComponentNames: ["One", "Two"],
      extractFromFormatMessageCall: true,
    };

    createManageCommand(args => expect(args).toEqual(want)).parse(argv);
  });

  it("Should set outMode to 'file' when using the --out-file option.", () => {
    const argv = `node intl-extract -l en,jp -f locales.json src/**/*.js`.split(" ");
    const want = { outMode: "file", outPath: "locales.json" };
    createManageCommand(args => expect(args).toMatchObject(want)).parse(argv);
  });

  it("Should throw error if both -o and -f are specified.", () => {
    const argv = `node intl-extract -l en,jp -f locales.json -o locales src/**/*.js`.split(" ");
    expect(() => createManageCommand(() => undefined).parse(argv)).toThrowError();
  });

  it("Should throw error if neither -o or -f are specified.", () => {
    const argv = `node intl-extract -l en,jp src/**/*.js`.split(" ");
    expect(() => createManageCommand(() => undefined).parse(argv)).toThrowError();
  });
});

describe("logTranslationStats", () => {
  it("Should transform the stats into pretty strings.", () => {
    const result = prettyStats({
      addedIds: ["a", "b"],
      removedIds: ["c", "d"],
      addedLocales: ["hr"],
      removedLocales: ["nl"],
      emptyCountTotal: 4,
      emptyCountByLocale: { en: 2, hr: 2 },
      duplicates: {
        a: [
          { file: "files/a", column: 20, line: 30 },
          { file: "files/b", column: 25, line: 35 },
        ],
      },
    });

    expect(result).toMatchInlineSnapshot(`
      "[30m[43m Found 1 Duplicate ids: [49m[39m
      [33m  ID: a[39m
          at files/a:30:20
          at files/b:35:25
      [30m[42m Added 2 IDs: [49m[39m
        a
        b

      [30m[42m Removed 2 IDs: [49m[39m
        c
        d

      [30m[42m Added 1 locales: [49m[39m
        hr

      [30m[42m Removed 1 locales: [49m[39m
        nl

      [30m[42m Found 4 empty translation keys: [49m[39m
        2 empty keys for locale en
        2 empty keys for locale hr
      "
    `);
  }),
    it("Should hide empty stats from the output.", () => {
      const result = prettyStats({
        addedIds: ["a", "b"],
        removedIds: [],
        addedLocales: [],
        removedLocales: [],
        emptyCountTotal: 0,
        emptyCountByLocale: {},
        duplicates: {},
      });

      expect(result).toMatchInlineSnapshot(`
            "[30m[42m Added 2 IDs: [49m[39m
              a
              b
            "
        `);
    }),
    it("Should inform the use if no changes were made.", () => {
      const result = prettyStats({
        addedIds: [],
        removedIds: [],
        addedLocales: [],
        removedLocales: [],
        emptyCountTotal: 0,
        emptyCountByLocale: {},
        duplicates: {},
      });

      expect(result).toMatchInlineSnapshot(`"[32m Translations are already up to date. [39m"`);
    });
});
