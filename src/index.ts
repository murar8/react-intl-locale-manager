import chalk from "chalk";
import { createCommand } from "commander";
import { manage } from "./manage";
import { indented } from "./util";

const version = require("../package.json").version;

export default () => {
  const program = createCommand();

  program
    .description(
      [
        "Extract react-intl translation messages from source files.",
        "The input language is expected to be TypeScript or any version of JavaScript",
        "that can be parsed by Babel (currently up to ES2020).",
      ].join("\n")
    )
    .version(version, "-v, --version")
    .helpOption("-h --help", "Show this screen.")
    .addCommand(manage);

  try {
    program.parse();
  } catch (error) {
    console.log(chalk.black.bgRed(` An error occured: `));
    console.log(indented(error.message));
    process.exit(1);
  }
};
