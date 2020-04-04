import chalk from "chalk";
import { isEmpty } from "lodash";
import { ManageCommandArgs } from "./command";
import { extractMessages } from "./extract";
import {
  findDuplicates,
  getEmptyKeyStats,
  getTranslationStats,
  updateTranslations,
} from "./translations";
import {
  indented,
  readJsonFromDir,
  readJsonFromFile,
  writeJsonToDir,
  writeJsonToFile,
} from "./util";

export const manage = ({
  files = [],
  ignore = [],
  outFile,
  outDir,
  languages = [],
  ...extractOpts
}: ManageCommandArgs) => {
  const messages = extractMessages(files, ignore, extractOpts);
  const translations = outFile ? readJsonFromFile(outFile) : outDir ? readJsonFromDir(outDir) : {};

  const nextTranslations = updateTranslations(translations, messages, languages);

  if (outFile) writeJsonToFile(outFile, nextTranslations);
  if (outDir) writeJsonToDir(outDir, nextTranslations);

  const duplicates = Object.entries(findDuplicates(messages));

  if (!isEmpty(duplicates)) {
    console.log(chalk.black.bgYellow(` Found ${duplicates.length} Duplicate ids: `));

    duplicates.forEach(([id, locations]) => {
      console.log(chalk.yellow(indented(`ID: ${id}`)));

      locations.forEach(({ file, line, column }) => {
        console.log(indented(`at ${file}:${line}:${column}`, 4));
      });
    });

    console.log();
  }

  const { addedIds, addedLocales, removedIds, removedLocales } = getTranslationStats(
    translations,
    nextTranslations
  );

  const { emptyCountByLocale, emptyCountTotal } = getEmptyKeyStats(nextTranslations);

  const logData: [string, string[]][] = [
    [`Added ${addedIds.length} IDs:`, addedIds],
    [`Removed ${removedIds.length} IDs:`, removedIds],
    [`Added ${addedLocales.length} locales:`, addedLocales],
    [`Removed ${removedLocales.length} locales:`, removedLocales],
    [
      `Found ${emptyCountTotal} empty translation keys:`,
      Object.entries(emptyCountByLocale).map(
        ([locale, count]) => `${count} empty keys for locale ${locale}`
      ),
    ],
  ];

  const nonemptyData = logData.filter(([, items]) => !isEmpty(items));

  if (!isEmpty(nonemptyData)) {
    nonemptyData.forEach(([title, items]) => {
      console.log(chalk.black.bgGreen(` ${title} `));
      console.log(indented(items.join("\n")));
      console.log("");
    });
  } else {
    console.log(chalk.green(` Translations are already up to date. `));
  }
};
