/* @flow */

import chalk from "chalk";
import { formatMessages } from "./error-helpers";

/**
 * Moves current line to the most top of console.
 */
export function clearConsole(sep?: boolean) {
  sep &&
    process.stdout.write(chalk.dim("----------------------------------\n"));
  process.stdout.write(
    process.platform === "win32" ? "\x1Bc" : "\x1B[2J\x1B[3J\x1B[H"
  );
}

/**
 * Actually prints message to the console
 */
export function print(
  msg: string[],
  clear?: boolean = false,
  clearWithSep?: boolean = false
) {
  if (clear) clearConsole(clearWithSep);
  return console.log(msg.join("\n")); // eslint-disable-line
}

/**
 *
 *
 * Helpers
 *
 */

export function addTopSpace(msg: string[]): string[] {
  return [""].concat(msg);
}

export function addBottomSpace(msg: string[]): string[] {
  return [].concat(msg, "");
}

// TODO: string[] | string[][]
export function joinWithSeparator(sep: string, msg: any): string[] {
  return msg.reduce((acc: string[], item: string | string[], index) => {
    acc = acc.concat(item);
    if (index < msg.length - 1) {
      acc.push(sep);
    }
    return acc;
  }, []);
}

export function joinWithSpace(msg: any): string[] {
  return joinWithSeparator("", msg);
}

export function doneBadge() {
  return chalk.bgGreen.black(" DONE ");
}

export function warningBadge() {
  return chalk.bgYellow.black(" WARNING ");
}

export function waitBadge() {
  return chalk.bgBlue.black(" WAIT ");
}

export function errorBadge() {
  return chalk.bgRed.black(" ERROR ");
}

export function separator() {
  return chalk.dim("---------");
}

/**
 *
 * Common Messages
 *
 */

export function eslintExtraWarningMsg(): string[] {
  return [
    "You may use special comments to disable some warnings.",
    "Use " +
      chalk.yellow("// eslint-disable-next-line") +
      " to ignore the next line.",
    "Use " +
      chalk.yellow("/* eslint-disable */") +
      " to ignore all warnings in a file."
  ];
}

export function fileDoesNotExistMsg(filename: string): string[] {
  return [
    errorBadge() + chalk.red(" File doesn't exist."),
    "",
    `You are trying to use ${chalk.yellow(
      '"' + filename + '"'
    )} as an entry point, but this file doesn't exist.`,
    `Please, choose an existing file or create ${chalk.yellow(
      '"' + filename + '"'
    )} manualy.`
  ];
}

export function foundPackageJson(): string[] {
  return [
    warningBadge() +
      " " +
      chalk.yellow('File "package.json" has been discovered.'),
    "",
    `Since ${chalk.yellow(
      '"node_modules"'
    )} folder doesn't exist and in order to avoid possible artifacts caused by`,
    `accidentally updated versions of npm modules Aik will run ${chalk.yellow(
      '"npm install"'
    )} in current directory.`,
    "",
    waitBadge() + " " + chalk.blue("Installing npm modules...")
  ];
}

export function installingModuleMsg(moduleName: string): string[] {
  return [`Installing module "${chalk.yellow(moduleName)}" ...`];
}

/**
 *
 * Dev Server Messages
 *
 */

export function devServerBanner(
  filename: string,
  flags: CLIFlags,
  params: AikParams
): string[] {
  const msg: string[] = [chalk.magenta("Entry point:      ") + filename];

  if (params.template.short) {
    msg.push(chalk.magenta("Custom template:  ") + params.template.short);
  }

  if (flags.oldPort) {
    msg.push(
      chalk.magenta("Port changed:     ") +
        `${chalk.bgRed.black(
          " " + flags.oldPort + " "
        )} -> ${chalk.bgGreen.black(" " + flags.port + " ")}`
    );
  }

  msg.push(
    chalk.magenta("Server:           ") +
      chalk.cyan(`http://${flags.host}:${flags.port}`)
  );

  if (params.ngrok) {
    msg.push(chalk.magenta("Ngrok:            ") + chalk.cyan(params.ngrok));
  }

  if (flags.react) {
    msg.push(chalk.magenta("React Hot Loader: ") + chalk.yellow("enabled"));
  }

  return msg;
}

export function devServerInvalidBuildMsg(): string[] {
  return [waitBadge() + " " + chalk.blue("Compiling...")];
}

export function devServerCompiledSuccessfullyMsg(
  filename: string,
  flags: CLIFlags,
  params: AikParams,
  buildDuration: number
): string[] {
  const msg = devServerBanner(filename, flags, params);
  msg.unshift("");
  msg.unshift(
    doneBadge() +
      " " +
      chalk.green(`Compiled successfully in ${buildDuration}ms!`)
  );
  return msg;
}

export function devServerFailedToCompileMsg(): string[] {
  // clearConsole(true);
  return [errorBadge() + " " + chalk.red("Failed to compile.")];
}

export function devServerCompiledWithWarningsMsg(
  filename: string,
  flags: CLIFlags,
  params: AikParams,
  buildDuration: number
): string[] {
  const msg = devServerBanner(filename, flags, params);
  msg.unshift("");
  msg.unshift(
    warningBadge() +
      " " +
      chalk.yellow(`Compiled with warnings in ${buildDuration}ms.`)
  );
  msg.push("", separator());
  return msg;
}

export function devServerFileDoesNotExistMsg(filename: string): string[] {
  return [warningBadge() + chalk.yellow(` File "${filename}" doesn\'t exist.`)];
}

export function devServerRestartMsg(module: string): string[] {
  return [
    warningBadge() +
      " " +
      chalk.yellow(`New npm module was added (${module}).`),
    "",
    `Restarting of the ${chalk.yellow('"webpack-dev-server"')} is requried.`,
    "",
    "Please be patient and wait until restart completes, otherwise some changes might not be tracked."
  ];
}

export function devServerModuleDoesntExists(
  module: string,
  filename: string
): string[] {
  return [
    errorBadge() + " " + chalk.red(`Module '${module}' doesn't exists.`),
    "",
    `Error in ${chalk.yellow(filename)}`,
    "",
    `Webpack tried to resolve module ${chalk.bgYellow.black(
      " " + module + " "
    )} which doesn't exist.`,
    "",
    `It's likely caused by a ${chalk.yellow("typo")} in the module name.`
  ];
}

export function devServerReactRequired(): string[] {
  return [
    warningBadge() + " " + chalk.yellow('"react" required.'),
    "",
    `In order to make ${chalk.yellow(
      '"react-hot-loader"'
    )} work, ${chalk.yellow('"react"')} and ${chalk.yellow(
      '"react-dom"'
    )} are required.`,
    "",
    waitBadge() + " " + chalk.blue("Installing required modules...")
  ];
}

/**
 *
 * Build Messages
 *
 */

export function builderBanner(
  filename: string,
  flags: CLIFlags,
  params: AikParams
): string[] {
  const msg = [
    waitBadge() + " " + chalk.blue("Building..."),
    "",
    chalk.magenta("Entry point:     ") + filename
  ];

  if (params.template.short) {
    msg.push(chalk.magenta("Custom template: ") + params.template.short);
  }

  const base = flags.base;
  if (base && typeof base === "string") {
    msg.push(chalk.magenta("Base path:       ") + base);
  }

  return msg;
}

export function builderRemovingDistMsg(distPath: string): string[] {
  return [chalk.yellow("Removing folder: ") + distPath];
}

export function builderRunningBuildMsg(): string[] {
  return [chalk.yellow("Running webpack production build...")];
}

export function builderErrorMsg(err: string[]): string[] {
  const msg = formatMessages(err);

  return [
    errorBadge() +
      " " +
      chalk.red("Failed to create a production build. Reason:"),
    ""
  ].concat(msg);
}

export function builderSuccessMsg(
  distShortName: string,
  buildStats: BuildStats
): string[] {
  const assets = buildStats.assets;
  const longestNameSize =
    assets.reduce(
      (acc, item) => (item.name.length > acc ? item.name.length : acc),
      0
    ) + 1;
  const padStringPlaceholder = " ".repeat(longestNameSize);
  const padString = (placeholder: string, str: string) =>
    (str + placeholder).substr(0, placeholder.length);

  return [
    doneBadge() + ` in ${buildStats.buildDuration}ms`,
    "",
    chalk.green(
      `Aik has successfully generated a bundle in the ${chalk.cyan(
        '"' + distShortName + '"'
      )} folder!`
    ),
    chalk.green(
      "The bundle is optimized and ready to be deployed to production."
    ),
    "",
    chalk.bgMagenta.black(" ASSETS "),
    "",
    buildStats.assets
      .map(asset => {
        return [
          `${chalk.magenta(padString(padStringPlaceholder, asset.name + ":"))}`,
          `${asset.size.toFixed(2)}kb, ${asset.sizeGz.toFixed(2)}kb gzip`
        ].join(" ");
      })
      .join("\n")
  ];
}
