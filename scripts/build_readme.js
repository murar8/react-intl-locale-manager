#!/usr/bin/env node

const { readFileSync, writeFileSync } = require("fs-extra");
const { execFileSync } = require("child_process");
const { join } = require("path");

const BIN = join(__dirname, "../bin/locale-manager");
const TEMPLATE = join(__dirname, "../README_template.md");

const help = execFileSync(BIN, ["--help"], { env: { COLUMNS: "80" }, stdio: "pipe" });
let readme = readFileSync(TEMPLATE, "utf-8");

readme = readme.replace("@TEMPLATE_HELP", help.toString());

writeFileSync(join(__dirname, "../README.md"), readme);
