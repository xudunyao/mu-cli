# mu-cli

## 远程模板配置（GitHub）

把模板配置放在仓库根目录 `templates.json`，推送后使用 GitHub Raw 地址作为 `MU_TEMPLATES_URL`。

示例地址（把用户名和仓库名换成你的）：

`https://raw.githubusercontent.com/<owner>/<repo>/main/templates.json`

`templates.json` 格式：

```json
[
  {
    "name": "vite-template",
    "value": "xudunyao/learn-vue3-core",
    "desc": "基于vite的vue3 + 前端工具链项目模板"
  }
]
```

### Windows PowerShell 设置

- 当前终端会话生效：
  - `$env:MU_TEMPLATES_URL="https://raw.githubusercontent.com/<owner>/<repo>/main/templates.json"`
- 永久写入当前用户环境变量：
  - `[System.Environment]::SetEnvironmentVariable("MU_TEMPLATES_URL","https://raw.githubusercontent.com/<owner>/<repo>/main/templates.json","User")`

设置后重新打开终端，执行 `mu-cli list` 即可看到远程模板。