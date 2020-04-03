import { createManageCommand, ManageCommandArgs } from "./manage";

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
