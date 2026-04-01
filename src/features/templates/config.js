const DEFAULT_TEMPLATES = [
  {
    name: 'webpack-template',
    value: 'xudunyao/learn-vue3-core',
    desc: '基于webpack5的vue3项目模板'
  },
  {
    name: 'vue-cli-template',
    value: 'xudunyao/taskify',
    desc: '基于vue-cli4的vue3项目模板'
  },
  {
    name: 'vite-template',
    value: 'xudunyao/learn-vue3-core',
    desc: '基于vite的vue3 + 前端工具链项目模板'
  }
];
const DEFAULT_TEMPLATES_URL =
  'https://raw.githubusercontent.com/xudunyao/mu-cli/master/templates.json';

function isValidTemplate(item) {
  return (
    item &&
    typeof item.name === 'string' &&
    item.name.trim() &&
    typeof item.value === 'string' &&
    item.value.trim() &&
    typeof item.desc === 'string'
  );
}

function normalizeTemplates(items) {
  if (!Array.isArray(items)) {
    return null;
  }
  const normalized = items
    .filter(isValidTemplate)
    .map((item) => ({
      name: item.name.trim(),
      value: item.value.trim(),
      desc: item.desc.trim()
    }));
  return normalized.length ? normalized : null;
}

export async function loadTemplates() {
  const remoteUrl = process.env.MU_TEMPLATES_URL?.trim() || DEFAULT_TEMPLATES_URL;
  if (!remoteUrl) {
    return DEFAULT_TEMPLATES;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 4000);
  try {
    const response = await fetch(remoteUrl, {
      method: 'GET',
      headers: { Accept: 'application/json' },
      signal: controller.signal
    });

    if (!response.ok) {
      return DEFAULT_TEMPLATES;
    }
    const data = await response.json();
    const templates = normalizeTemplates(data);
    return templates || DEFAULT_TEMPLATES;
  } catch {
    return DEFAULT_TEMPLATES;
  } finally {
    clearTimeout(timeout);
  }
}

export const messages = [
  {
    message: '请输入项目名称:',
    name: 'name',
    validate(val) {
      if (val.match(/[\u4E00-\u9FFF`~!@#$%&^*[\]()\\;:<.>/?]/g)) {
        return '项目名称存在非法字符';
      }
      return true;
    }
  },
  {
    message: '请输入项目关键词(,分割):',
    name: 'keywords'
  },
  {
    message: '请输入项目描述:',
    name: 'description'
  },
  {
    message: '请输入作者名称:',
    name: 'author'
  }
];
