import { difference, groupBy, intersection, union } from "lodash";
import { Descriptor } from "./extract";

export type Translations = { [locale: string]: { [id: string]: string } };

const updateMessages = (current: { [id: string]: string }, next: { [id: string]: string }) => {
  return Object.keys(next).reduce((vs, v) => ({ ...vs, [v]: current[v] || next[v] }), {});
};

export function updateTranslations(
  current: Translations,
  messages: Descriptor[],
  languages: string[]
): Translations {
  const next = messages.reduce((vs, v) => ({ ...vs, [v.id]: v.defaultMessage || "" }), {});

  return languages.reduce(
    (ls, l) => ({ ...ls, [l]: current[l] ? updateMessages(current[l], next) : next }),
    {}
  );
}

export type Location = { file: string; line: number; column: number };

const getLocation = ({ file, start: { line, column } }: Descriptor) => ({
  file,
  line,
  column,
});

export function findDuplicates(descriptors: Descriptor[]): Record<string, Location[]> {
  return Object.values(groupBy(descriptors, d => d.id))
    .filter(ds => ds.length > 1)
    .reduce(
      (result, descriptors) => ({ ...result, [descriptors[0].id]: descriptors.map(getLocation) }),
      {} as Record<string, Location[]>
    );
}

const getCommonIds = (t: Translations) => intersection(...Object.values(t).map(Object.keys));

export function getAddedIds(current: Translations, next: Translations) {
  return difference(getCommonIds(next), getCommonIds(current));
}

const getAllIds = (t: Translations) => union(...Object.values(t).map(Object.keys));

export function getRemovedIds(current: Translations, next: Translations) {
  return difference(getAllIds(current), getAllIds(next));
}

export function getAddedLanguages(current: Translations, next: Translations) {
  return difference(Object.keys(next), Object.keys(current));
}

export function getRemovedLanguages(current: Translations, next: Translations) {
  return difference(Object.keys(current), Object.keys(next));
}

export function getEmptyKeysCount(translations: Translations): Record<string, number> {
  return Object.entries(translations)
    .map(([locale, trans]) => [locale, Object.values(trans).filter(v => !v).length] as const)
    .filter(([, count]) => count > 0)
    .reduce((vs, [locale, count]) => ({ ...vs, [locale]: count }), {});
}
