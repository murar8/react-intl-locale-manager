import { transformFileSync } from "@babel/core";
import { extractMessages } from "./extract";

jest.mock("@babel/core", () => ({ transformFileSync: jest.fn() }));

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

  const messages = extractMessages(["files/a", "files/b"]);
  expect(messages).toEqual([{ id: "id_1" }, { id: "id_2" }, { id: "id_3" }, { id: "id_3" }]);
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

  extractMessages(["files/a"], options);

  expect(transformFileSync).toHaveBeenCalledWith(
    "files/a",
    expect.objectContaining({
      plugins: expect.arrayContaining([["react-intl", expect.objectContaining(options)]]),
    })
  );
});
