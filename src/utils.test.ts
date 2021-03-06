import { readJsonFromDir, writeJsonToDir, splitComma, indented, inlined } from "./util";
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

describe("splitComma", () => {
  it("Should split the input string at every comma.", () => {
    expect(splitComma("")).toEqual([]);
    expect(splitComma("abc")).toEqual(["abc"]);
    expect(splitComma("a,b,c")).toEqual(["a", "b", "c"]);
    expect(splitComma(",a,,b,c,")).toEqual(["a", "b", "c"]);
  });
  it("Should filter falsy values out of the resulting array.", () => {
    expect(splitComma(",a,,b,c,")).toEqual(["a", "b", "c"]);
  });
});

describe("indented", () => {
  it("Should add the specified leading whitespace to the start of every line.", () => {
    expect(indented("")).toEqual("  ");
    expect(indented("abc\ndef\nghi")).toEqual("  abc\n  def\n  ghi");
    expect(indented("abc", 4)).toEqual("    abc");
  });
});

describe("inlined", () => {
  it("Should replace whitespace sequences with a single space.", () => {
    expect(inlined``).toEqual("");
    expect(inlined` \n \n `).toEqual(" ");
    expect(inlined`a`).toEqual("a");
    expect(inlined`a \n b c \n\n d e\nf`).toEqual("a b c d e f");
  });
});

describe("readJsonFromDir", () => {
  it("Should return an empty object when the path does not exist.", () => {
    (pathExistsSync as jest.Mock).mockReturnValueOnce(false);
    expect(readJsonFromDir("path/a")).toEqual({});
  });

  it("Should return the content all the files in a directory merged in a JSON object.", () => {
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
    expect(readJsonSync).toHaveBeenNthCalledWith(1, "path/a/a.json");
    expect(readJsonSync).toHaveBeenNthCalledWith(2, "path/a/b.json");
    expect(readJsonSync).toHaveBeenNthCalledWith(3, "path/a/c.json");
  });
});

describe("writeJsonToDir", () => {
  it("Should write each entry in the input object to a file.", () => {
    writeJsonToDir("path/a", { a: { v: 1 }, b: { v: 2 }, c: { v: 3 } });

    expect(mkdirpSync).toHaveBeenCalledTimes(1);
    expect(mkdirpSync).toHaveBeenCalledWith("path/a");

    expect(writeJSON).toHaveBeenCalledTimes(3);
    expect(writeJSON).toHaveBeenNthCalledWith(1, "path/a/a.json", { v: 1 }, { spaces: 2 });
    expect(writeJSON).toHaveBeenNthCalledWith(2, "path/a/b.json", { v: 2 }, { spaces: 2 });
    expect(writeJSON).toHaveBeenNthCalledWith(3, "path/a/c.json", { v: 3 }, { spaces: 2 });
  });
});
