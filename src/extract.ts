import { transformFileSync, TransformOptions } from "@babel/core";
import { SourceLocation } from "@babel/types";
import { ExtractedMessageDescriptor } from "babel-plugin-react-intl";
import { OptionsSchema } from "babel-plugin-react-intl/dist/options";
import glob from "globby";
import { flatMap } from "lodash";

export type Descriptor = SourceLocation & { file: string } & ExtractedMessageDescriptor;

export type IntlOptions = Pick<
  OptionsSchema,
  "additionalComponentNames" | "extractFromFormatMessageCall" | "moduleSourceName"
>;

const createBabelOptions = (options?: IntlOptions): TransformOptions => ({
  babelrc: false,
  code: false,
  parserOpts: {
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
  },
  plugins: [["react-intl", { ...options, extractSourceLocation: true }]],
});

export function extractMessages(files: string[], ignore: string[], intlOptions: IntlOptions) {
  const options = createBabelOptions(intlOptions);

  return flatMap(
    glob.sync(files, { ignore }),
    p => (transformFileSync(p, options) as any).metadata["react-intl"].messages as Descriptor[]
  );
}
