[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg)](https://github.com/semantic-release/semantic-release) [![Commitizen friendly](https://img.shields.io/badge/commitizen-friendly-brightgreen.svg)](http://commitizen.github.io/cz-cli/) ![build](https://github.com/murar8/react-intl-manager/workflows/CI/badge.svg) [![codecov](https://codecov.io/gh/murar8/react-intl-manager/branch/master/graph/badge.svg)](https://codecov.io/gh/murar8/react-intl-manager)

# react-intl-manager

_react-intl-manager_ is a CLI utility created to aid in the extraction and manteinance of [react-intl](https://github/formatjs/react-intl) messages. It uses [@babel/core](https://babeljs.io/docs/en/babel-core) and [babel-plugin-react-intl](https://github.com/formatjs/formatjs/tree/master/packages/babel-plugin-react-intl) under the hood to handle message extraction.

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
@TEMPLATE_COMMON_HELP
```

```bash
intl-manager manage --help
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
