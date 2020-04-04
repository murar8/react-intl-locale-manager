import { execSync } from "child_process";
import { copySync, readJSONSync, removeSync } from "fs-extra";
import path from "path";

const BIN = path.join(__dirname, "../../bin/locale-manager");
const BIN_ARGS = ["manage", "-l", "en,es", "./**/*.{ts,tsx}", "./**/*.js"];

const FIXTURES_DIR = path.join(__dirname, "fixtures");
const TEST_DIR = path.join(__dirname, "actual");

const loadFixture = (name: string) => copySync(path.join(FIXTURES_DIR, name), TEST_DIR);

const run = (...args: string[]) =>
  execSync(["node", BIN, ...BIN_ARGS, ...args].join(" "), { cwd: TEST_DIR });

beforeEach(() => removeSync(TEST_DIR));

it("Should output the translation files in a directory when using the --out-dir option.", () => {
  loadFixture("base");
  run("-o", "locales");

  for (const code of ["en", "es"]) {
    expect(readJSONSync(path.join(TEST_DIR, "locales", `${code}.json`))).toMatchSnapshot();
  }
});

it("Should output the translation files in a single file when using the --out-file option.", () => {
  loadFixture("base");
  run("-f", "locales.json");

  expect(readJSONSync(path.join(TEST_DIR, "locales.json"))).toMatchSnapshot();
});

it("Should not extract messages from the files specified in the --ignore option.", () => {
  loadFixture("base");
  run("-f", "locales.json", "-i", "./*.tsx");

  expect(readJSONSync(path.join(TEST_DIR, "locales.json"))).toMatchSnapshot();
});

it("Should pass extraction options to babel-plugin-react-intl.", () => {
  loadFixture("optional");
  run(
    "-f",
    "locales.json",
    "--module-source-name",
    "intl",
    "--additional-component-names",
    "FormattedDummy1,FormattedDummy2",
    "--extract-from-format-message-call"
  );

  expect(readJSONSync(path.join(TEST_DIR, "locales.json"))).toMatchSnapshot();
});

it("Should merge existing translations with the extracted messages.", () => {
  loadFixture("changes");
  run("-f", "locales.json");

  expect(readJSONSync(path.join(TEST_DIR, "locales.json"))).toMatchSnapshot();
});

it("Should print information about the changes to console.", () => {
  loadFixture("changes");
  const stdout = run("-f", "locales.json");

  expect(stdout.toString()).toMatchSnapshot();
});

it("Should show the help message.", () => {
  loadFixture("no_changes");
  const stdout = run("--help");
  expect(stdout.toString()).toMatchSnapshot();
});
