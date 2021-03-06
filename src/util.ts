import {
  existsSync,
  mkdirpSync,
  pathExistsSync,
  readdirSync,
  readJsonSync,
  writeJSON,
} from "fs-extra";
import path from "path";

export const inlined = ([input]: TemplateStringsArray) => input.replace(/\s+/gm, " ");

export const indented = (s: string, level = 2) => s.replace(/^/gm, " ".repeat(level));

export const splitComma = (v: string, vs: string[] = []) => [
  ...vs,
  ...v.split(",").filter(Boolean),
];

export const readJsonFromFile = (path: string) => (existsSync(path) ? readJsonSync(path) : {});

export function readJsonFromDir(dir: string): any {
  if (!pathExistsSync(dir)) return {};

  return readdirSync(dir, { withFileTypes: true }).reduce(
    (files, { name }) => ({
      ...files,
      [path.basename(name, ".json")]: readJsonFromFile(path.join(dir, name)),
    }),
    {}
  );
}

export function writeJsonToFile(file: string, data: any) {
  writeJSON(file, data, { spaces: 2 });
}

export function writeJsonToDir(dir: string, data: { [name: string]: any }) {
  mkdirpSync(dir);

  for (const [name, payload] of Object.entries(data)) {
    writeJsonToFile(path.join(dir, `${name}.json`), payload);
  }
}
