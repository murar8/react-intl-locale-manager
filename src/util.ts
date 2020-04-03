import {
  existsSync,
  mkdirpSync,
  pathExistsSync,
  readdirSync,
  readJsonSync,
  writeJSON,
} from "fs-extra";
import path from "path";

export const readJsonFromFile = (path: string) => (existsSync(path) ? readJsonSync(path) : {});

export function readJsonFromDir(dir: string): any {
  if (!pathExistsSync(dir)) return {};

  return readdirSync(dir, { withFileTypes: true }).reduce(
    (files, { name }) => ({ ...files, [path.basename(name, ".json")]: readJsonFromFile(name) }),
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
