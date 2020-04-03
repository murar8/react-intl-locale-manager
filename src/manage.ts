import { createCommand } from "commander";
import glob from "globby";
import { isEmpty, pick } from "lodash";
import { basename } from "path";
import { Descriptor, extractMessages } from "./extract";
import logger from "./logger";
import {
  findDuplicates,
  getAddedIds,
  getAddedLanguages,
  getEmptyKeysCount,
  getRemovedIds,
  getRemovedLanguages,
  Translations,
  updateTranslations,
} from "./translations";
import { readJsonFromDir, readJsonFromFile, writeJsonToDir, writeJsonToFile } from "./util";

const splitComma = (v: string, vs: string[] = []) => [...vs, ...v.split(",").filter(Boolean)];

export type ManageCommandArgs = {
  files: string[];
  ignore?: string[];
  languages: string[];
  outMode: "file" | "directory";
  outPath: string;
  moduleSourceName: string;
  additionalComponentNames?: string[];
  extractFromFormatMessageCall: boolean;
};

export const createManageCommand = (handler: (args: ManageCommandArgs) => void | Promise<void>) => {
  const manage = createCommand("manage");

  manage.on("--help", () => {
    const program = basename(process.argv[1]);
    const command = manage.name();

    console.log(
      [
        `\nExamples:`,
        `  ${program} ${command} -l en,es -o ./locales -i src/**/*.test.tsx src/**/*.tsx`,
        `  ${program} ${command} -l de,it -f locales.json src/**/*.{js,ts,jsx,tsx}`,
        "\nFor additional information, visit: https://github.com/murar8/react-intl-manager",
      ].join("\n")
    );
  });

  manage
    .arguments("[files...]")
    .description(
      [
        "Manage the translation process of projects that use the 'react-intl' translation library.",
        "This command extracts react-intl messages into key-value pairs of id and message",
        "that can be imported directly in code and passed to the 'IntlProvider' component.",
        "Additonally, existing translations will be merged with the extracted messages",
        "and information about the changes will be printed to console.",
      ].join("\n")
    )
    .requiredOption(
      "-l --languages <codes>",
      [
        "Comma-separated list of language codes to mantain. A translation entry be generated",
        "and mantained for every code in this list.",
      ].join(" "),
      splitComma
    )
    .option(
      "-o --out-dir <path>",
      [
        "Output the extracted messages in JSON format in the specified directory,",
        "generating a [locale].json file for each locale.",
        "\nMutually exclusive with '--out-file'.",
      ].join(" ")
    )
    .option(
      "-f --out-file <path>",
      [
        "Output the extracted messages in a single JSON file containing an entry for each locale.",
        "\nMutually exclusive with '--out-dir'.",
      ].join(" ")
    )
    .option(
      "-i --ignore <glob>",
      [
        "Glob pattern designationg the files to exlcude from the translation process.",
        "It is possible to specify the flag multiple times to use more than one pattern.",
      ].join(" "),
      (v, vs: string[] = []) => [...vs, v]
    )
    .option(
      "--module-source-name <name>",
      "The ES6 module source name of the React Intl package.",
      "react-intl"
    )
    .option(
      "--additional-component-names <names>",
      [
        "Comma separated list of component names to extract messages from.",
        "Note that default we check for the fact that 'FormattedMessage'",
        "is imported from '--module-source-name' to make sure variable alias",
        "works. This option does not do that so it's less safe.",
      ].join(" "),
      splitComma
    )
    .option(
      "--extract-from-format-message-call",
      [
        "Opt-in to extract from 'intl.formatMessage' calls with the restriction that it has ",
        "to be called with an object literal such as 'intl.formatMessage({ id: 'foo', ...})'",
      ].join(""),
      false
    );

  manage.action((files, { outDir, outFile, ...args }) => {
    if (outDir && outFile) {
      throw new Error("Options --out-dir and --out-file are mutually exclusive.");
    }

    if (!(outDir || outFile)) {
      throw new Error("Missing required arguments --out-dir or --out-file.");
    }

    const options = pick(
      args,
      "languages",
      "ignore",
      "moduleSourceName",
      "additionalComponentNames",
      "extractFromFormatMessageCall"
    );

    const [outPath, outMode]: [string, any] = outDir ? [outDir, "directory"] : [outFile, "file"];

    handler({ ...options, files, outPath, outMode });
  });

  return manage;
};

function logDuplicateStats(descriptors: Descriptor[]) {
  const duplicates = Object.entries(findDuplicates(descriptors)).map(
    ([id, locations]) =>
      `ID: ${id}\n` +
      locations.map(({ file, line, column }) => `  at ${file}:${line}:${column}`).join("\n")
  );

  if (!isEmpty(duplicates)) {
    logger.warn("Duplicate ids found:", ...duplicates);
  }
}

function logTranslationStats(current: Translations, next: Translations) {
  const addedIds = getAddedIds(current, next);
  const removedIds = getRemovedIds(current, next);

  const addedLanguages = getAddedLanguages(current, next);
  const removedLanguages = getRemovedLanguages(current, next);

  const empty = Object.entries(getEmptyKeysCount(next));
  const emptyTotal = empty.reduce((tot, [, count]) => tot + count, 0);
  const emptyEach = empty.map(([locale, count]) => `${count} empty keys for locale ${locale}`);

  const messages: [string, string[]][] = [
    [`Added ${addedIds.length} IDs:`, addedIds],
    [`Removed ${removedIds.length} IDs:`, removedIds],
    [`Added ${addedLanguages.length} languages:`, addedLanguages],
    [`Removed ${removedLanguages.length} languages:`, removedLanguages],
    [`Found ${emptyTotal} empty translation keys:`, emptyEach],
  ];

  messages
    .filter(([, items]) => !isEmpty(items))
    .forEach(([title, items]) => logger.info(title, ...items));
}

export const manage = createManageCommand(
  ({ files, ignore = [], outPath, outMode, languages, ...extractOpts }) => {
    const expandedFiles = glob.sync(files, { ignore });
    const messages = extractMessages(expandedFiles, extractOpts);

    const readJson = outMode === "file" ? readJsonFromFile : readJsonFromDir;
    const translations = readJson(outPath);
    const nextTranslations = updateTranslations(translations, messages, languages);

    const writeJson = outMode === "file" ? writeJsonToFile : writeJsonToDir;
    writeJson(outPath, nextTranslations);

    logDuplicateStats(messages);
    logTranslationStats(translations, nextTranslations);
  }
);
