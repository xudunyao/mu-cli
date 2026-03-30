import clone from './clone.js'
import figlet from 'figlet';
import chalk from 'chalk';

console.log('\r\n' + chalk.greenBright.bold(figlet.textSync('mu-cli', {
  font: 'Standard',
  horizontalLayout: 'default',
  verticalLayout: 'default',
  width: 80,
  whitespaceBreak: true
})));

clone("xudunyao/learn-vue3-core", "demo")
