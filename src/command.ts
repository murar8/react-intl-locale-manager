import { pick } from "lodash";
import { CommandModule } from "yargs";
import { inlined } from "./util";
import { manage } from "./manage";

export type ManageCommandArgs = {
  files?: string[];
  languages?: string[];
  ignore?: string[];
  outFile?: string;
  outDir?: string;
  moduleSourceName?: string;
  additionalComponentNames?: string[];
  extractFromFormatMessageCall?: boolean;
};

export const manageCommand: CommandModule = {
  command: "$0 [files..]",

  describe: inlined`Manage the translation process of projects that use the react-intl 
                translation library. This tool will extract react-intl messages into key-value 
                pairs of id and message that can be imported directly in code and passed to 
                the 'IntlProvider' component. Additonally, existing translations will be merged
                with the extracted messages and information about the changes will be printed 
                to console.`,

  builder: yargs =>
    yargs
      .example("$0 -l en,es -d ./locales -i src/**/*.test.js src/**/*.js", "")
      .example("$0 -l it,de -f locales.json src/**/*.{js,tsx}", "")
      .epilogue(
        "For additional information, visit: https://github.com/murar8/react-intl-locale-manager"
      )
      .option("l", {
        type: "string",
        alias: "languages",
        coerce: (v: string) => v.split(",").filter(Boolean),
        describe: inlined`Comma-separated list of language codes to support. A translation will 
                          be generated and mantained for every code in this list.`,
      })
      .option("f", {
        type: "string",
        alias: "out-file",
        describe: inlined`Path to the file where the extracted messages will be stored 
                          in a single JSON object grouped by locale.`,
      })
      .option("d", {
        type: "string",
        alias: "out-dir",
        describe: inlined`Path to the directory where the extracted messages will be stored 
                          generating a [locale].json file for each locale.`,
      })
      .option("i", {
        type: "string",
        alias: "ignore",
        describe: inlined`Glob pattern designating the files to exlcude from the translation 
                          process.To define more than one ignore pattern, just list the flag 
                          multiple times.`,
      })
      .option("module-source-name", {
        type: "string",
        describe: inlined`The ES6 module source name of the React Intl package.`,
      })
      .option("additional-component-names", {
        type: "string",
        coerce: (v: string) => v.split(",").filter(Boolean),
        describe: inlined`Comma-separated list of component names to extract messages from.
                          Note that default we check for the fact that 'FormattedMessage'
                          is imported from '--module-source-name' to make sure variable alias
                          works. This option does not do that so it's less safe.,`,
      })
      .option("extract-from-format-message-call", {
        type: "boolean",
        describe: inlined`Opt-in to extract from 'intl.formatMessage' calls with the restriction 
                          that it has to be called with an object literal 
                          such as 'intl.formatMessage({ id: 'foo', ...})`,
      })
      .positional("[files..]", {
        type: "string",
        describe: inlined`Space separated list of paths to be scanned for translations. 
                          Can contain glob patterns.`,
      }),

  handler: args => {
    const options = pick(
      args,
      "files",
      "languages",
      "ignore",
      "outFile",
      "outDir",
      "moduleSourceName",
      "additionalComponentNames",
      "extractFromFormatMessageCall"
    ) as ManageCommandArgs;

    manage(options);
  },
};
