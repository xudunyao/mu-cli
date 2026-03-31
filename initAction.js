import shell from 'shelljs';
import { existsSync } from 'fs';
import { resolve } from 'path';
import logSymbols from './logSymbols.js';
import clone from './clone.js';
import { templates } from './constants.js';
import { inquirerConfirm,removeDir } from './utils.js';

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
  if (existsSync(targetPath) && !option.force) {
    const answer = await inquirerConfirm('目录已存在，是否强制覆盖？');
    if (!answer.confirm) {
      console.log(logSymbols.error, '目录已存在，请重新输入项目名称');
      return;
    }
    await removeDir(targetPath)
  }else if (existsSync(targetPath) && option.force) {
    await removeDir(targetPath)
  }
};
export default initAction;