import chalk from "chalk";
import fs from "fs-extra";
import figlet from 'figlet';
import inquirer from 'inquirer'
import ora from "ora";
import path from "path";
export function isUnicodeSupported() {
  // 操作系统平台是否为 win32（Windows）
  if (process.platform !== "win32") {
    // 判断 process.env.TERM 是否为 'linux'，
    // 这表示在 Linux 控制台（内核）环境中。
    return process.env.TERM !== "linux"; // Linux console (kernel)
  }
  return (
    Boolean(process.env.CI) || // 是否在持续集成环境中
    Boolean(process.env.WT_SESSION) || // Windows 终端环境（Windows Terminal）中的会话标识
    Boolean(process.env.TERMINUS_SUBLIME) || // Terminus 插件标识
    process.env.ConEmuTask === "{cmd::Cmder}" || // ConEmu 和 cmder 终端中的任务标识
    process.env.TERM_PROGRAM === "Terminus-Sublime" ||
    process.env.TERM_PROGRAM === "vscode" || // 终端程序的标识，可能是 'Terminus-Sublime' 或 'vscode'
    process.env.TERM === "xterm-256color" ||
    process.env.TERM === "alacritty" || // 终端类型，可能是 'xterm-256color' 或 'alacritty'
    process.env.TERMINAL_EMULATOR === "JetBrains-JediTerm" // 终端仿真器的标识，可能是 'JetBrains-JediTerm'
  );
}

// 启动时展示品牌标题，便于区分脚手架输出内容。
export function printBanner(){
  console.log(
    '\r\n' +
      chalk.greenBright.bold(
        figlet.textSync('mu-cli', {
          font: 'Standard',
          horizontalLayout: 'default',
          verticalLayout: 'default',
          width: 80,
          whitespaceBreak: true
        })
      )
  );
}

export const inquirerConfirm = async (message) => { 
  const answer = await inquirer.prompt({
    name: 'confirm',
    type: 'confirm',
    message
  });
  return answer
}

export async function removeDir(dir) {
  // 调用时再解析 cwd，避免进程切换目录后仍使用旧路径。
  const targetPath = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
  const spinner = ora({
    text: `正在删除文件夹${chalk.cyan(dir)}`,
    color: 'yellow',
  }).start();

  try {
    if (!await fs.pathExists(targetPath)) {
      spinner.info(chalk.yellowBright(`文件夹${chalk.cyan(dir)}不存在，跳过删除`));
      return true;
    }

    await fs.remove(targetPath);
    spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}成功`));
    return true;
  }
  catch (err) {
    spinner.fail(chalk.redBright(`删除文件夹${chalk.cyan(dir)}失败`));
    console.error(err);
    return false;
  }
}