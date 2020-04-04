import { transformFileSync } from "@babel/core";
import { extractMessages } from "./extract";
import globby from "globby";

jest.mock("globby", () => ({ sync: jest.fn((dirs: string[]) => dirs) }));

jest.mock("@babel/core", () => ({
  transformFileSync: jest.fn(() => ({
    metadata: {
      "react-intl": {
        messages: [{ id: "id_1" }, { id: "id_2" }],
      },
    },
  })),
}));

it("Should pass the input paths to `globby.sync`.", () => {
  extractMessages(["files/a", "files/b"], ["ignore/a"], {});
  expect(globby.sync).toHaveBeenCalledWith(["files/a", "files/b"], { ignore: ["ignore/a"] });
});

it("Should pass the extraction options to react-intl.", () => {
  (transformFileSync as jest.Mock).mockReturnValueOnce({
    metadata: {
      "react-intl": {
        messages: [],
      },
    },
  });

  const options = {
    additionalComponentNames: ["Component"],
    extractFromFormatMessageCall: true,
    moduleSourceName: "intl",
  };

  extractMessages(["files/a"], [], options);

  expect(transformFileSync).toHaveBeenCalledWith(
    "files/a",
    expect.objectContaining({
      plugins: expect.arrayContaining([["react-intl", expect.objectContaining(options)]]),
    })
  );
});

it("Should extract react-intl messages from the babel results.", () => {
  (transformFileSync as jest.Mock).mockReturnValueOnce({
    metadata: {
      "react-intl": {
        messages: [{ id: "id_1" }, { id: "id_2" }],
      },
    },
  });

  (transformFileSync as jest.Mock).mockReturnValueOnce({
    metadata: {
      "react-intl": {
        messages: [{ id: "id_3" }, { id: "id_3" }],
      },
    },
  });

  const messages = extractMessages(["files/a", "files/b"], [], {});
  expect(messages).toEqual([{ id: "id_1" }, { id: "id_2" }, { id: "id_3" }, { id: "id_3" }]);
});
