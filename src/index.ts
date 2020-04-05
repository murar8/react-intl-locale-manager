import yargs from "yargs";
import { manageCommand } from "./command";

export default () => {
  yargs
    .detectLocale(false)
    .strict()
    .wrap(yargs.terminalWidth() || 80)
    .command(manageCommand).argv;
};
