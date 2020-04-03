[![build](https://github.com/murar8/react-intl-locale-manager/workflows/ci/badge.svg)](https://github.com/murar8/react-intl-locale-manager/actions?query=workflow%3Aci)
[![codecov](https://codecov.io/gh/murar8/react-intl-locale-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/murar8/react-intl-locale-manager)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/93059009875b41c9925fc6f59a401fe6)](https://app.codacy.com/manual/lnzmrr/react-intl-locale-manager?utm_source=github.com&utm_medium=referral&utm_content=murar8/react-intl-locale-manager&utm_campaign=Badge_Grade_Dashboard)
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
yarn add react-intl-locale-manager
```

or

```bash
npm install --save react-intl-locale-manager
```

## Usage

```bash
locale-manager --help
```

```
@TEMPLATE_COMMON_HELP
```

```bash
locale-manager manage --help
```

```
@TEMPLATE_MANAGE_HELP
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
