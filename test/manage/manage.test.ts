import { execSync } from "child_process";
import { copySync, readJSONSync, removeSync } from "fs-extra";
import path from "path";

const BIN = path.join(__dirname, "../../bin/locale-manager");

const FIXTURES_DIR = path.join(__dirname, "fixtures");
const TEST_DIR = path.join(__dirname, "actual");

const run = (fixture: string, args: string[]) => {
  copySync(path.join(FIXTURES_DIR, fixture), TEST_DIR);
  return execSync(["node", BIN, ...args].join(" "), { cwd: TEST_DIR });
};

beforeEach(() => removeSync(TEST_DIR));

it("Should output the translation files in a directory when using the --out-dir option.", () => {
  run("base", ["-l", "en,es", "-d", "locales", "./**/*.{ts,tsx}", "./**/*.js"]);

  for (const code of ["en", "es"]) {
    expect(readJSONSync(path.join(TEST_DIR, "locales", `${code}.json`))).toMatchSnapshot();
  }
});

it("Should output the translation files in a single file when using the --out-file option.", () => {
  run("base", ["-l", "en,es", "-f", "locales.json", "./**/*.{ts,tsx}", "./**/*.js"]);

  expect(readJSONSync(path.join(TEST_DIR, "locales.json"))).toMatchSnapshot();
});

it("Should not extract messages from the paths defined in the --ignore option.", () => {
  run("base", [
    "-l",
    "en,es",
    "-f",
    "locales.json",
    "-i",
    "./*.tsx",
    "./**/*.{ts,tsx}",
    "./**/*.js",
  ]);

  expect(readJSONSync(path.join(TEST_DIR, "locales.json"))).toMatchSnapshot();
});

it("Should pass extraction options to babel-plugin-react-intl.", () => {
  run("optional", [
    "-l",
    "en,es",
    "-f",
    "locales.json",
    "--module-source-name",
    "intl",
    "--additional-component-names",
    "FormattedDummy1,FormattedDummy2",
    "--extract-from-format-message-call",
    "./**/*.{js,ts,jsx,tsx}",
  ]);

  expect(readJSONSync(path.join(TEST_DIR, "locales.json"))).toMatchSnapshot();
});

it("Should merge existing translations with the extracted messages.", () => {
  run("changes", ["-l", "en,es", "-f", "locales.json", "./**/*.{js,ts,jsx,tsx}"]);
  expect(readJSONSync(path.join(TEST_DIR, "locales.json"))).toMatchSnapshot();
});

it("Should print information about the changes to stdout.", () => {
  const stdout = run("changes", ["-l", "en,es", "-f", "locales.json", "./**/*.{js,ts,jsx,tsx}"]);
  expect(stdout.toString()).toMatchSnapshot();
});

it("Should print information about empty translation keys to stdout.", () => {
  const stdout = run("no_changes", ["-l", "en,es", "-f", "locales.json", "./**/*.{js,ts,jsx,tsx}"]);
  expect(stdout.toString()).toMatchSnapshot();
});

it("Should show the help message when invoked with the --help option.", () => {
  const stdout = run("base", ["--help"]);
  expect(stdout.toString()).toMatchSnapshot();
});
