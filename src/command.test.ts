import { manageCommand, ManageCommandArgs } from "./command";
import yargs from "yargs";
import { manage } from "./manage";

jest.mock("./manage", () => ({ manage: jest.fn() }));

it("Should pass all the command line arguments to the handler function.", () => {
  const argv = `-i src/*.test.js
                -i src/*.test.ts
                -l en,jp 
                -d locales
                -f locales.json
                --module-source-name intl
                --additional-component-names One,Two
                --extract-from-format-message-call
                src/*.js src/*.ts`.split(/\s+/);

  const want: ManageCommandArgs = {
    files: ["src/*.js", "src/*.ts"],
    ignore: ["src/*.test.js", "src/*.test.ts"],
    languages: ["en", "jp"],
    outFile: "locales.json",
    outDir: "locales",
    moduleSourceName: "intl",
    additionalComponentNames: ["One", "Two"],
    extractFromFormatMessageCall: true,
  };

  yargs.command(manageCommand).parse(argv);

  expect(manage).toHaveBeenCalledWith(want);
});
