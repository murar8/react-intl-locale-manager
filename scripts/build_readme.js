#!/usr/bin/env node

const { readFileSync, writeFileSync } = require("fs-extra");
const { spawnSync } = require("child_process");
const { join } = require("path");

const BIN = join(__dirname, "../bin/locale-manager");
const TEMPLATE = join(__dirname, "../README_template.md");

const commonHelp = spawnSync(BIN, ["--help"]);
const manageHelp = spawnSync(BIN, ["manage", "--help"]);

let readme = readFileSync(TEMPLATE, "utf-8");

readme = readme.replace("@TEMPLATE_COMMON_HELP", commonHelp.stdout.toString());
readme = readme.replace("@TEMPLATE_MANAGE_HELP", manageHelp.stdout.toString());

writeFileSync(join(__dirname, "../README.md"), readme);
