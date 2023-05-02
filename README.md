[![build](https://github.com/murar8/react-intl-locale-manager/workflows/ci/badge.svg)](https://github.com/murar8/react-intl-locale-manager/actions?query=workflow%3Aci)
[![codecov](https://codecov.io/gh/murar8/react-intl-locale-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/murar8/react-intl-locale-manager)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release)
[![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/)
![node](https://img.shields.io/node/v/react-intl-locale-manager)

# react-intl-locale-manager

_react-intl-locale-manager_ is a CLI utility created to aid in the extraction and manteinance of [react-intl](https://github/formatjs/react-intl) translations. It uses [@babel/core](https://babeljs.io/docs/en/babel-core) and [babel-plugin-react-intl](https://github.com/formatjs/formatjs/tree/master/packages/babel-plugin-react-intl) under the hood to handle message extraction.

## Features

- Extract and merge messages from source files.
- Detect duplicate IDs.
- Get information about added and deleted keys and languages.
- Get information about empty translation keys.

## Installation

**npm global**:

```bash
npm install --global react-intl-locale-manager
```

**npm local**:

```bash
npm install --save --dev react-intl-locale-manager
```

**yarn local**:

```bash
yarn add --dev react-intl-locale-manager
```

## Demo

<img src="https://raw.github.com/murar8/react-intl-locale-manager/master/demo.svg?sanitize=true">

## Usage

The best way to obtain usage information is to use the tool's comprehensive internal help:

```bash
locale-manager --help
```

```
locale-manager [files..]

Manage the translation process of projects that use the react-intl translation
library. This tool will extract react-intl messages into key-value pairs of id
and message that can be imported directly in code and passed to the
'IntlProvider' component. Additonally, existing translations will be merged with
the extracted messages and information about the changes will be printed to
console.

Positionals:
  [files..]  Space separated list of paths to be scanned for translations. Can
             contain glob patterns.                                     [string]

Options:
  --help                              Show help                        [boolean]
  --version                           Show version number              [boolean]
  -l, --languages                     Comma-separated list of language codes to
                                      support. A translation will be generated
                                      and mantained for every code in this list.
                                                                        [string]
  -f, --out-file                      Path to the file where the extracted
                                      messages will be stored in a single JSON
                                      object grouped by locale.         [string]
  -d, --out-dir                       Path to the directory where the extracted
                                      messages will be stored generating a
                                      [locale].json file for each locale.
                                                                        [string]
  -i, --ignore                        Glob pattern designating the files to
                                      exlcude from the translation process.To
                                      define more than one ignore pattern, just
                                      list the flag multiple times.     [string]
  --module-source-name                The ES6 module source name of the React
                                      Intl package.                     [string]
  --additional-component-names        Comma-separated list of component names to
                                      extract messages from. Note that default
                                      we check for the fact that
                                      'FormattedMessage' is imported from
                                      '--module-source-name' to make sure
                                      variable alias works. This option does not
                                      do that so it's less safe.,       [string]
  --extract-from-format-message-call  Opt-in to extract from
                                      'intl.formatMessage' calls with the
                                      restriction that it has to be called with
                                      an object literal such as
                                      'intl.formatMessage({ id: 'foo', ...})
                                                                       [boolean]

Examples:
  locale-manager -l en,es -d ./locales -i src/**/*.test.js src/**/*.js
  locale-manager -l it,de -f locales.json src/**/*.{js,tsx}

For additional information, visit:
https://github.com/murar8/react-intl-locale-manager

```

## Contributing

If you would like to make a contribution to the project you can just fork the the repo, then submit a pull request.

Please note that this projects uses [semantic-release](https://semantic-release.gitbook.io/semantic-release/) following the [Angular Commit Message Conventions](https://github.com/angular/angular.js/blob/master/DEVELOPERS.md#-git-commit-guidelines), so version bumping is completely automated. In order to ensure the commit messages follow the specification, you can use the `commit` script in `package.json`. The `README.md` and `CHANGELOG.md` are automatically generated when pushing the code to the repository. To modify the readme, edit `README_template.md`.

#### Pre-commit checklist

|                            |                         |
| -------------------------- | ----------------------- |
| Run the unit tests         | `yarn test:unit`        |
| Build the project          | `yarn build`            |
| Run the integration tests. | `yarn test:integration` |
