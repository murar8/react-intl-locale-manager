import React, { Component } from "react";
import { defineMessages, FormattedMessage } from "react-intl";
export * as ns from "mod";

@decorator
export class Decorators {
  classProperties = 1;
  #classPrivateProperties = 1;
  #classPrivateMethods() {}
}

const asyncGenerators = async function* () {};

const doExpressions = () => {
  do {} while (true);
};

const optionalCatchBinding = () => {
  try {
    throw new Error();
  } catch {}
};

const bigInt = 100n;
const dynamicImport = import("./guy").then(a);
const importMeta = import.meta.url;
const nullishCoalescingOperator = a ?? b;
const numericSeparator = 1_000_000;
const objectRestSpread = { b, ...c };
const optionalChaining = a?.b;

const messages = defineMessages({
  message4: { id: "message4", defaultMessage: "content 4", description: "description 4" },
  message5: { id: "message5" },
});

export default class Bar extends Component {
  render() {
    const msg = msgs?.header;
    return (
      <div>
        <FormattedMessage {...messages} />
        <FormattedMessage {...messages.content} />
        <FormattedMessage {...messages.kittens} />
      </div>
    );
  }
}
