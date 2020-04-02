import React, { Component } from "react";
import { defineMessages, FormattedMessage } from "react-intl";

const messages = defineMessages({
  message1: { id: "message1", defaultMessage: "content 1", description: "description 1" },
  message2: { id: "message2" },
});

export const Foo: React.FC = () => (
  <>
    <FormattedMessage {...messages.message1} />
    <FormattedMessage {...messages.message2} />
    <FormattedMessage id="message3" defaultMessage="content 3" description="description 3" />
  </>
);
