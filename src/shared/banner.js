import chalk from 'chalk';
import figlet from 'figlet';

export function printBanner() {
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
