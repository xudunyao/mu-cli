import chalk from 'chalk';
import fs from 'fs-extra';
import ora from 'ora';
import path from 'path';
import shell from 'shelljs';
import logSymbols from './logSymbols.js';

const resolveApp = (relativePath) => path.resolve(process.cwd(), relativePath);

export async function removeDir(dir) {
  const targetPath = path.isAbsolute(dir) ? dir : path.resolve(process.cwd(), dir);
  const spinner = ora({
    text: `正在删除文件夹${chalk.cyan(dir)}`,
    color: 'yellow'
  }).start();

  try {
    if (!(await fs.pathExists(targetPath))) {
      spinner.info(chalk.yellowBright(`文件夹${chalk.cyan(dir)}不存在，跳过删除`));
      return true;
    }

    await fs.remove(targetPath);
    spinner.succeed(chalk.greenBright(`删除文件夹${chalk.cyan(dir)}成功`));
    return true;
  } catch (err) {
    spinner.fail(chalk.redBright(`删除文件夹${chalk.cyan(dir)}失败`));
    console.error(err);
    return false;
  }
}

export async function changePackageJson(name, answers) {
  try {
    const packagePath = resolveApp(`${name}/package.json`);
    const pkg = await fs.readJson(packagePath);

    Object.entries(answers || {}).forEach(([key, value]) => {
      if (typeof value !== 'string') {
        return;
      }

      const trimmedValue = value.trim();
      if (key === 'name') {
        pkg[key] = trimmedValue || name;
        return;
      }
      if (!trimmedValue) {
        return;
      }
      if (key === 'keywords') {
        const keywords = trimmedValue
          .split(',')
          .map((keyword) => keyword.trim())
          .filter(Boolean);
        if (keywords.length) {
          pkg[key] = keywords;
        }
        return;
      }
      pkg[key] = trimmedValue;
    });

    await fs.writeJson(packagePath, pkg, { spaces: 2 });
  } catch (err) {
    console.log(logSymbols.error, chalk.red('对不起,修改自定义package.json失败,请手动修改'));
    console.log(err);
  }
}

export function npmInstall(dir) {
  const spinner = ora('正在安装依赖......').start();
  if (shell.exec(`cd ${shell.pwd()}/${dir} && npm install --force -d`).code !== 0) {
    console.log(logSymbols.error, chalk.yellow('自动安装依赖失败，请手动安装'));
    shell.exit(1);
  }
  spinner.succeed(chalk.green('~~~依赖安装成功~~~'));
  spinner.succeed(chalk.green('~~~项目创建完成~~~'));
  shell.exit(1);
}
