#!/usr/bin/env node

const { readFileSync, writeFileSync } = require("fs-extra");
const { spawnSync } = require("child_process");
const { join } = require("path");

const BIN = join(__dirname, "../bin/locale-manager");
const TEMPLATE = join(__dirname, "../README_template.md");

const help = spawnSync(BIN, ["--help"]);
let readme = readFileSync(TEMPLATE, "utf-8");

readme = readme.replace("@TEMPLATE_HELP", help.stdout.toString());

writeFileSync(join(__dirname, "../README.md"), readme);
