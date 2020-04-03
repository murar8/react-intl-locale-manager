import { readJsonFromDir, writeJsonToDir } from "./util";
import {
  readdirSync,
  pathExistsSync,
  existsSync,
  readJsonSync,
  mkdirpSync,
  writeJSON,
} from "fs-extra";

jest.mock("fs-extra", () => ({
  pathExistsSync: jest.fn(),
  existsSync: jest.fn(),
  readdirSync: jest.fn(),
  readJsonSync: jest.fn(),
  mkdirpSync: jest.fn(),
  writeJSON: jest.fn(),
}));

describe("readJsonFromDir", () => {
  it("Should return an empty object when the path does not exist.", () => {
    (pathExistsSync as jest.Mock).mockReturnValueOnce(false);
    expect(readJsonFromDir("path/a")).toEqual({});
  });
  it("Should return all the files in a directory merged in a json object.", () => {
    (pathExistsSync as jest.Mock).mockReturnValueOnce(true);

    (readdirSync as jest.Mock).mockReturnValueOnce([
      { name: "a.json" },
      { name: "b.json" },
      { name: "c.json" },
    ]);

    (existsSync as jest.Mock).mockReturnValue(true);
    (readJsonSync as jest.Mock).mockReturnValueOnce({ v: 1 });
    (readJsonSync as jest.Mock).mockReturnValueOnce({ v: 2 });
    (readJsonSync as jest.Mock).mockReturnValueOnce({ v: 3 });

    expect(readJsonFromDir("path/a")).toEqual({ a: { v: 1 }, b: { v: 2 }, c: { v: 3 } });
  });
});

describe("readJsonFromDir", () => {
  it("Should write each entry in the input object to a file.", () => {
    writeJsonToDir("path/a", { a: { v: 1 }, b: { v: 2 }, c: { v: 3 } });

    expect(mkdirpSync).toHaveBeenCalledTimes(1);
    expect(mkdirpSync).toHaveBeenCalledWith("path/a");

    expect(writeJSON).toHaveBeenCalledTimes(3);
    expect(writeJSON).toHaveBeenNthCalledWith(2, "path/a/b.json", { v: 2 }, { spaces: 2 });
  });
});
