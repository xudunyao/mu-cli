import chalk from 'chalk';
import { readFile } from 'fs/promises';
import { program } from 'commander';
import initAction from '../features/create/initAction.js';
import { listTemplates } from '../features/templates/listAction.js';
import { printBanner } from '../shared/banner.js';

const pkg = JSON.parse(await readFile(new URL('../../package.json', import.meta.url)));

const HELP_HINT = `\r\nRun ${chalk.cyan('mu-cli <command> --help')} for detailed usage of given command\r\n`;

program.version(pkg.version, '-v, --version', '输出当前版本号');

program
  .name('mu-cli')
  .description('自定义脚手架')
  .usage('<command> [options]')
  .on('--help', () => {
    console.log(HELP_HINT);
  });

program
  .command('create <app-name>')
  .description('创建一个新项目')
  .option('-f, --force', '强制创建')
  .option('-t, --template <template>', '选择模板')
  .option('-i, --ignore', '忽略输入项目信息，直接创建项目')
  .action(initAction);

program.command('list').description('查看模板列表').action(listTemplates);

printBanner();

if (process.argv.length <= 2) {
  program.help();
}

program.parse(process.argv);
