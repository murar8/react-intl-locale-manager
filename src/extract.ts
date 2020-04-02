import { BabelFileMetadata, ParserOptions, transformFileSync } from "@babel/core";
import { SourceLocation } from "@babel/types";
import { ExtractedMessageDescriptor } from "babel-plugin-react-intl";
import { OptionsSchema } from "babel-plugin-react-intl/dist/options";
import { flatMap } from "lodash";

export type Descriptor = SourceLocation & ExtractedMessageDescriptor;

export type IntlOptions = Pick<
  OptionsSchema,
  "additionalComponentNames" | "extractFromFormatMessageCall" | "moduleSourceName"
>;

const baseParserOptions: ParserOptions = {
  sourceType: "unambiguous",
  allowAwaitOutsideFunction: true,
  allowImportExportEverywhere: true,
  allowReturnOutsideFunction: true,
  allowSuperOutsideMethod: true,
  allowUndeclaredExports: true,
  plugins: [
    "asyncGenerators",
    "bigInt",
    "classPrivateMethods",
    "classPrivateProperties",
    "classProperties",
    "decorators-legacy",
    "doExpressions",
    "dynamicImport",
    "exportDefaultFrom",
    "exportNamespaceFrom",
    "functionBind",
    "functionSent",
    "importMeta",
    "jsx",
    "logicalAssignment",
    "nullishCoalescingOperator",
    "numericSeparator",
    "objectRestSpread",
    "optionalCatchBinding",
    "optionalChaining",
    "partialApplication",
    "throwExpressions",
    "topLevelAwait",
    "typescript",
  ],
};

type ReactIntlMetadata = BabelFileMetadata & {
  "react-intl": {
    messages: Descriptor[];
  };
};

const createBabelOptions = (options?: IntlOptions) => ({
  babelrc: false,
  code: false,
  parserOpts: baseParserOptions,
  plugins: [["react-intl", { ...options, extractSourceLocation: true }]],
});

export const extractMessages = (paths: string[], intlOptions?: IntlOptions) => {
  const options = createBabelOptions(intlOptions);
  const extract = (path: string) => transformFileSync(path, options)?.metadata as ReactIntlMetadata;
  return flatMap(paths, path => extract(path)["react-intl"].messages);
};
