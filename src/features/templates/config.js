const DEFAULT_TEMPLATES = [
  {
    name: 'vue3-vite-starter',
    value: 'xudunyao/vue3-vite-starter',
    desc: '[Vue3] Vite + Vue Router + Pinia + ESLint'
  },
  {
    name: 'react-vite-starter',
    value: 'xudunyao/react-vite-starter',
    desc: '[React] Vite + React + TypeScript + Zustand'
  },
  {
    name: 'h5-vant-vue3',
    value: 'xudunyao/h5-vant-vue3-template',
    desc: '[H5] Vue3 + Vite + Vant 移动端模板'
  },
  {
    name: 'h5-react-mobile',
    value: 'xudunyao/h5-react-mobile-template',
    desc: '[H5] React + Vite + antd-mobile 模板'
  },
  {
    name: 'miniprogram-native',
    value: 'xudunyao/wechat-miniprogram-template',
    desc: '[小程序] 微信原生小程序模板'
  },
  {
    name: 'taro-react-template',
    value: 'xudunyao/taro-react-template',
    desc: '[小程序] Taro + React 多端模板'
  },
  {
    name: 'uniapp-vue3-template',
    value: 'xudunyao/uniapp-vue3-template',
    desc: '[小程序/App] uni-app + Vue3 模板'
  },
  {
    name: 'app-uni-template',
    value: 'xudunyao/app-uni-template',
    desc: '[App] uni-app 跨端应用模板'
  },
  {
    name: 'app-ionic-react',
    value: 'xudunyao/ionic-react-template',
    desc: '[App] Ionic + React 混合应用模板'
  },
  {
    name: 'admin-vue3-element-plus',
    value: 'xudunyao/vue3-admin-template',
    desc: '[后台管理] Vue3 + Element Plus + 权限路由'
  },
  {
    name: 'admin-react-antd',
    value: 'xudunyao/react-admin-template',
    desc: '[后台管理] React + Ant Design + ProLayout'
  },
  {
    name: 'nextjs-dashboard',
    value: 'xudunyao/next-dashboard-template',
    desc: '[后台管理] Next.js 全栈后台模板'
  },
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
