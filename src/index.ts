import { createCommand } from "commander";
import log from "./logger";
import { manage } from "./manage";

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
    log.error("An error occured:", error.message);
    process.exit(1);
  }
};
