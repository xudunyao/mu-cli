#!/usr/bin/env node
import clone from './clone.js'
import figlet from 'figlet';
import chalk from 'chalk';
import { program } from 'commander';
import { templates } from './constants.js';

program.version("0.0.1", "-v, --version", "输出当前版本号")

program
  .name("mu-cli")
  .description("自定义脚手架")
  .usage("<command> [options]")
  .on('--help', () => {
    console.log('\r\n' + chalk.greenBright.bold(figlet.textSync('mu-cli', {
      font: 'Standard',
      horizontalLayout: 'default',
      verticalLayout: 'default',
      width: 80,
      whitespaceBreak: true
    })));
    console.log(`\r\nRun ${chalk.cyan(`mu-cli <command> --help`)} for detailed usage of given command\r\n`)
})

program
  .command("create <app-name>")
  .description("创建一个新项目")
  .option("-f, --force", "强制创建")
  .option("-t, --template <template>", "选择模板")
  .action((name, options) => {
    console.log(name)
    console.log('options', options)
  })

program
  .command("list")
  .description("列出所有项目")
  .action(() => {
    console.log(chalk.yellowBright('模板列表'));
    templates.forEach((temp, index) => {
      console.log(`(${index + 1}) | ${temp.name} | ${temp.value} | ${temp.desc}`)
    })
  })

console.log('\r\n' + chalk.greenBright.bold(figlet.textSync('mu-cli', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true
})));

program.parse(process.argv)
// clone("xudunyao/learn-vue3-core", "demo")
