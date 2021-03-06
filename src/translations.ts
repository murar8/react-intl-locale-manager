import { difference, groupBy, intersection, union, pick } from "lodash";
import { Descriptor } from "./extract";

export type Translations = { [locale: string]: { [id: string]: string } };

const mergeMessages = (current: { [id: string]: string }, next: { [id: string]: string }) => {
  return Object.keys(next).reduce((vs, v) => ({ ...vs, [v]: current[v] || next[v] || "" }), {});
};

export function updateTranslations(
  current: Translations,
  messages: Descriptor[],
  languages: string[]
): Translations {
  const next = messages.reduce((vs, v) => ({ ...vs, [v.id]: v.defaultMessage || "" }), {});

  return languages.reduce(
    (ls, l) => ({ ...ls, [l]: current[l] ? mergeMessages(current[l], next) : next }),
    {}
  );
}

export type Location = { file: string; line: number; column: number };

export function findDuplicates(descriptors: Descriptor[]): Record<string, Location[]> {
  const getLocation = ({ file, start: { line, column } }: Descriptor) => ({
    file,
    line,
    column,
  });

  return Object.values(groupBy(descriptors, d => d.id))
    .filter(ds => ds.length > 1)
    .reduce(
      (result, descriptors) => ({ ...result, [descriptors[0].id]: descriptors.map(getLocation) }),
      {} as Record<string, Location[]>
    );
}

export type TranslationStats = {
  addedIds: string[];
  removedIds: string[];
  addedLocales: string[];
  removedLocales: string[];
};

export function getTranslationStats(current: Translations, next: Translations): TranslationStats {
  const currentLocales = Object.keys(current);
  const nextLocales = Object.keys(next);
  const commonLocales = intersection(currentLocales, nextLocales);

  const getIds = (t: Translations) =>
    union(...Object.values(pick(t, commonLocales)).map(Object.keys));

  return {
    addedIds: difference(getIds(next), getIds(current)),
    removedIds: difference(getIds(current), getIds(next)),
    addedLocales: difference(nextLocales, currentLocales),
    removedLocales: difference(currentLocales, nextLocales),
  };
}

export type EmptyKeyStats = {
  emptyCountTotal: number;
  emptyCountByLocale: Record<string, number>;
};

export function getEmptyKeyStats(translations: Translations): EmptyKeyStats {
  const empty = Object.entries(translations)
    .map(([locale, trans]) => [locale, Object.values(trans).filter(v => !v).length] as const)
    .filter(([, count]) => count > 0);

  return {
    emptyCountTotal: empty.reduce((vs, [, count]) => vs + count, 0),
    emptyCountByLocale: empty.reduce((vs, [locale, count]) => ({ ...vs, [locale]: count }), {}),
  };
}
