#!/usr/bin/env node
import figlet from 'figlet';
import chalk from 'chalk';
import { table } from 'table';
import { program } from 'commander';
import { templates } from './constants.js';
import { readFile } from 'fs/promises';
import logSymbols from './logSymbols.js';
import initAction from './initAction.js';
import { printBanner,inquirerConfirm } from './utils.js';

// 从 package.json 动态读取版本号，避免手动维护重复版本信息。
const pkg = JSON.parse(
  await readFile(
    new URL('./package.json', import.meta.url)
  )
);

const HELP_HINT = `\r\nRun ${chalk.cyan('mu-cli <command> --help')} for detailed usage of given command\r\n`;

program.version(pkg.version, '-v, --version', '输出当前版本号');

program
  .name('mu-cli')
  .description('自定义脚手架')
  .usage('<command> [options]')
  .on('--help', () => {
    // 帮助信息末尾补充统一提示，便于继续探索子命令。
    console.log(HELP_HINT);
  });

program
  .command('create <app-name>')
  .description('创建一个新项目')
  .option('-f, --force', '强制创建')
  .option('-t, --template <template>', '选择模板')
  .action(initAction);

program
  .command('list')
  .description('查看模板列表')
  .action(() => {
    // 表头使用统一高亮色，数据行使用分层配色提升可读性。
    const data = templates.map((item, index) => {
      const isEvenRow = index % 2 === 0;
      const nameColor = isEvenRow ? chalk.bold.yellowBright : chalk.bold.yellow;
      const repoColor = isEvenRow ? chalk.cyanBright : chalk.cyan;
      const descColor = isEvenRow ? chalk.whiteBright : chalk.gray;
      return [nameColor(item.name), repoColor(item.value), descColor(item.desc)];
    });
    data.unshift([
      chalk.bold.hex('#FFD166')('模板名称'),
      chalk.bold.hex('#7FDBFF')('模板地址'),
      chalk.bold.hex('#C3F584')('模板描述')
    ]);
    console.log(table(data));
  });

printBanner();

// 没有传入参数时直接输出帮助，减少“运行后无反馈”的困惑。
if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);

