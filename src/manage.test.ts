import { createManageCommand, ManageCommandArgs, updateTranslations } from "./manage";

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
      file: "path/file_a",
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
