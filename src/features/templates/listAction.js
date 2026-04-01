import chalk from 'chalk';
import { table } from 'table';
import { loadTemplates } from './config.js';

export async function listTemplates() {
  const templates = await loadTemplates();
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
}
