import shell from 'shelljs';
import chalk from 'chalk';
import { existsSync } from 'fs';
import { resolve } from 'path';
import logSymbols from './logSymbols.js';
import clone from './clone.js';
import { templates } from './constants.js';
import { inquirerConfirm, inquirerChoose } from './interactive.js';
import { removeDir } from './utils.js';

const RESERVED_NAMES = new Set([
  'con', 'prn', 'aux', 'nul',
  'com1', 'com2', 'com3', 'com4', 'com5', 'com6', 'com7', 'com8', 'com9',
  'lpt1', 'lpt2', 'lpt3', 'lpt4', 'lpt5', 'lpt6', 'lpt7', 'lpt8', 'lpt9',
  'node_modules'
]);

function validateProjectName(name) {
  const projectName = name?.trim();
  if (!projectName) {
    return '项目名称不能为空。';
  }
  if (projectName.length < 2 || projectName.length > 50) {
    return '项目名称长度需在 2 到 50 个字符之间。';
  }
  if (projectName !== projectName.toLowerCase()) {
    return '项目名称必须全部使用小写字母。';
  }
  if (!/^[a-z]/.test(projectName)) {
    return '项目名称必须以小写字母开头。';
  }
  // 仅允许小写字母、数字、中划线和下划线。
  if (!/^[a-z0-9_-]+$/.test(projectName)) {
    return '项目名称仅支持小写字母、数字、中划线(-)和下划线(_)。';
  }
  if (/[-_]{2,}/.test(projectName)) {
    return '项目名称不能出现连续的连接符（--、__、-_、_-）。';
  }
  if (/[-_]$/.test(projectName)) {
    return '项目名称不能以下划线或中划线结尾。';
  }
  if (RESERVED_NAMES.has(projectName)) {
    return `项目名称 "${projectName}" 为系统保留名称，请更换。`;
  }
  return null;
}

const initAction = async (name, option = {}) => {
  if (!shell.which('git')) {
    console.log(logSymbols.error, '对不起，运行脚本必须先安装 git!');
    shell.exit(1);
  }

  const validationError = validateProjectName(name);
  if (validationError) {
    console.log(logSymbols.error, validationError);
    return;
  }

  const projectName = name.trim();
  const targetPath = resolve(process.cwd(), projectName);

  if (existsSync(targetPath)) {
    const shouldForceRemove = option.force
      ? true
      : (await inquirerConfirm('目录已存在，是否强制覆盖？')).confirm;
    if (!shouldForceRemove) {
      console.log(logSymbols.error, '已取消创建：目录已存在，请更换项目名称后重新执行命令');
      return;
    }
    const removed = await removeDir(targetPath);
    if (!removed) {
      console.log(logSymbols.error, '删除原目录失败，已终止创建。');
      return;
    }
  }

  let repository = '';
  // 支持命令行指定模板；未指定时交互选择。
  if (option.template) {
    const template = templates.find((item) => item.name === option.template);
    if (!template) {
      console.log(logSymbols.error, `不存在模板 ${chalk.yellow(option.template)}`);
      console.log(`\r\n运行 ${logSymbols.arrow} ${chalk.cyan('mu-cli list')} 查看所有可用模板\r\n`);
      return;
    }
    repository = template.value;
  } else {
    const choices = templates.map(item => item.name);
    const answer = await inquirerChoose('请选择项目模板:', choices,'list');
    const template = templates.find((item) => item.name === answer.choose)
    repository = template.value;
  }

  try {
    await clone(repository, projectName);
  } catch (err) {
    console.log(logSymbols.error, err);
    shell.exit(1);
  }
};
export default initAction;