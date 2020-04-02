import chalk from "chalk";

const indented = (s: string) => s.replace(/^/gm, "  ");

export const error = (title: string, ...data: string[]) => {
  console.log(chalk.black.bgRed(title));
  console.log(indented(data.join("\n")));
  console.log();
};

export const warn = (title: string, ...data: string[]) => {
  console.log(chalk.black.bgYellow(title));
  console.log(indented(chalk.yellow(data.join("\n"))));
  console.log();
};

export const info = (title: string, ...data: string[]) => {
  console.log(chalk.black.bgGreen(title));
  console.log(indented(data.join("\n")));
  console.log();
};

export default { error, warn, info };
