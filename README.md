[![build](https://github.com/murar8/react-intl-locale-manager/workflows/ci/badge.svg)](https://github.com/murar8/react-intl-locale-manager/actions?query=workflow%3Aci)
[![codecov](https://codecov.io/gh/murar8/react-intl-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/murar8/react-intl-manager)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=murar8/react-intl-locale-manager)](https://dependabot.com)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![node](https://img.shields.io/node/v/react-intl-locale-manager)
![license](https://img.shields.io/npm/l/react-intl-locale-manager)

# react-intl-locale-manager

_react-intl-locale-manager_ is a CLI utility created to aid in the extraction and manteinance of [react-intl](https://github/formatjs/react-intl) messages. It uses [@babel/core](https://babeljs.io/docs/en/babel-core) and [babel-plugin-react-intl](https://github.com/formatjs/formatjs/tree/master/packages/babel-plugin-react-intl) under the hood to handle message extraction.

## Features

- Extract messages from source files.
- Detect duplicate IDs.
- Get information about added and deleted IDs and languages.
- Get information about empty translation keys.

## Installation

```bash
yarn add react-intl-manager
```

or

```bash
npm install --save react-intl-manager
```

## Usage

```bash
intl-manager --help
```

```
Usage: locale-manager [options] [command]

Extract react-intl translation messages from source files.
The input language is expected to be TypeScript or any version of JavaScript
that can be parsed by Babel (currently up to ES2020).

Options:
  -v, --version                output the version number
  -h --help                    Show this screen.

Commands:
  manage [options] [files...]  Manage the translation process of projects
                               that use the 'react-intl' translation library.
                               This command extracts react-intl messages into
                               key-value pairs of id and message
                               that can be imported directly in code and passed
                               to the 'IntlProvider' component.
                               Additonally, existing translations will be
                               merged with the extracted messages
                               and information about the changes will be
                               printed to console.
  help [command]               display help for command

```

```bash
intl-manager manage --help
```

```
Usage: locale-manager manage [options] [files...]

Manage the translation process of projects that use the 'react-intl' translation library.
This command extracts react-intl messages into key-value pairs of id and message
that can be imported directly in code and passed to the 'IntlProvider' component.
Additonally, existing translations will be merged with the extracted messages
and information about the changes will be printed to console.

Options:
  -l --languages <codes>                Comma-separated list of language codes
                                        to mantain. A translation entry be
                                        generated and mantained for every code
                                        in this list.
  -o --out-dir <path>                   Output the extracted messages in JSON
                                        format in the specified directory,
                                        generating a [locale].json file for
                                        each locale.
                                        Mutually exclusive with '--out-file'.
  -f --out-file <path>                  Output the extracted messages in a
                                        single JSON file containing an entry
                                        for each locale.
                                        Mutually exclusive with '--out-dir'.
  -i --ignore <glob>                    Glob pattern designationg the files to
                                        exlcude from the translation process.
                                        It is possible to specify the flag
                                        multiple times to use more than one
                                        pattern.
  --module-source-name <name>           The ES6 module source name of the React
                                        Intl package. (default: "react-intl")
  --additional-component-names <names>  Comma separated list of component names
                                        to extract messages from. Note that
                                        default we check for the fact that
                                        'FormattedMessage' is imported from
                                        '--module-source-name' to make sure
                                        variable alias works. This option does
                                        not do that so it's less safe.
  --extract-from-format-message-call    Opt-in to extract from
                                        'intl.formatMessage' calls with the
                                        restriction that it has to be called
                                        with an object literal such as
                                        'intl.formatMessage({ id: 'foo', ...})'
                                        (default: false)
  -h, --help                            display help for command

Examples:
  locale-manager manage -l en,es -o ./locales -i src/**/*.test.tsx src/**/*.tsx
  locale-manager manage -l de,it -f locales.json src/**/*.{js,ts,jsx,tsx}

For additional information, visit: https://github.com/murar8/react-intl-manager

```

## Contributing

If you would like to make a contribution to the project you can fork it then submit a pull request.

Please note that this projects uses [semantic-release](https://semantic-release.gitbook.io/semantic-release/) following the [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines), so version bumping is completely automated. In order to ensure the commit messages follow the specification, you can use the `commit` script in `package.json`. The `README.md` and `CHANGELOG.md` are automatically generated when pushing the code to the repository. To modify the readme, edit `README_template.md`.

#### Pre-commit checklist

|                            |                         |
| -------------------------- | ----------------------- |
| Run the unit tests         | `yarn test:unit`        |
| Build the project          | `yarn build`            |
| Run the integration tests. | `yarn test:integration` |
