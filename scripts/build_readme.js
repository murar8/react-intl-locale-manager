#!/usr/bin/env node

const { readFileSync, writeFileSync } = require("fs-extra");
const { spawnSync } = require("child_process");
const { join } = require("path");

const commonHelp = spawnSync(join(__dirname, "../bin/intl-manager"), ["--help"]);
const manageHelp = spawnSync(join(__dirname, "../bin/intl-manager"), ["manage", "--help"]);

let readme = readFileSync(join(__dirname, "../README_template.md"), "utf-8");

readme = readme.replace("@TEMPLATE_COMMON_HELP", commonHelp.stdout.toString());
readme = readme.replace("@TEMPLATE_MANAGE_HELP", manageHelp.stdout.toString());

writeFileSync(join(__dirname, "../README.md"), readme);
