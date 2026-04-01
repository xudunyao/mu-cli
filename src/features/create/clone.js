import chalk from 'chalk';
import download from 'download-git-repo';
import ora from 'ora';

const clone = (remote, name, option = false) => {
  const spinner = ora('拉取中......').start();
  return new Promise((resolve, reject) => {
    download(remote, name, option, (err) => {
      if (err) {
        spinner.fail(chalk.red(err));
        reject(err);
        return;
      }
      spinner.succeed(chalk.green('拉取成功'));
      resolve();
    });
  });
};

export default clone;
