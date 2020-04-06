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
import { removeSync } from "fs-extra";

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

  if (outDir) removeSync(outDir);

  const nextTranslations = updateTranslations(translations, messages, languages);

  if (outFile) writeJsonToFile(outFile, nextTranslations);
  if (outDir) writeJsonToDir(outDir, nextTranslations);

  const duplicates = findDuplicates(messages);

  if (!isEmpty(duplicates)) {
    console.log(chalk.black.bgYellow(` Found ${Object.keys(duplicates).length} duplicate ids: `));

    Object.entries(duplicates).forEach(([id, locations]) => {
      console.log(chalk.yellow(indented(chalk.yellow(id))));

      locations.forEach(({ file, line, column }) => {
        console.log(indented(chalk`{dim at} {bold ${file}}{dim :${line}:${column}}`, 4));
      });
    });

    console.log();
  }

  const { emptyCountByLocale, emptyCountTotal } = getEmptyKeyStats(nextTranslations);

  if (!isEmpty(emptyCountByLocale)) {
    console.log(chalk.black.bgBlue(` Found ${emptyCountTotal} empty translation keys: `));

    Object.entries(emptyCountByLocale).forEach(([locale, count]) =>
      console.log(indented(`${chalk.bold(count)} empty keys for locale ${chalk.bold(locale)}`))
    );
    console.log();
  }

  const { addedIds, addedLocales, removedIds, removedLocales } = getTranslationStats(
    translations,
    nextTranslations
  );

  const translationOutput = ([
    [chalk.black.bgGreen(` Added ${addedIds.length} keys: `), addedIds],
    [chalk.black.bgMagenta(` Removed ${removedIds.length} keys: `), removedIds],
    [chalk.black.bgCyan(` Added ${addedLocales.length} locales: `), addedLocales],
    [chalk.black.bgMagenta(` Removed ${removedLocales.length} locales: `), removedLocales],
  ] as [string, string[]][]).filter(([, items]) => !isEmpty(items));

  if (!isEmpty(translationOutput)) {
    translationOutput.forEach(([title, items]) => {
      console.log(title);
      console.log(indented(items.join("\n")));
      console.log();
    });
  } else {
    console.log(chalk.green(`Translations are already up to date.`));
  }
};
