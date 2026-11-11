# PLSM 前端开发约定

## 范围与协作

- 本仓库是太初平台全寿命周期管理（PLSM）的前端，在既有平台模板上增量开发；配套后端为 `../workplace-plsm`，联动修改前读取其 `AGENTS.md`。
- 本目录不属于绩效或人事项目，不沿用那些项目的业务规则、Element Plus 组件或 pnpm 命令。
- 前端开发、提交、推送使用 `plsm` 分支并跟踪 `origin/plsm`；不得将 PLSM 业务直接提交到模板 `main`。开始工作先检查分支、工作区及暂存区，保留无关修改。
- 沿用用户已确认的完成后提交并推送约定；只暂存本次文件，提交说明使用 `feat`、`fix`、`docs` 等类型。后端独立提交，不能把前端分支约定套到后端。
- 仅记录长期约束；具体需求、部署步骤与验证结果放在相应文档，不把历史对话全文、凭据或临时测试结果加入本文件。

## 技术栈与目录

- 使用 Vue 3、TypeScript、Ant Design Vue 4、Pinia、Vue Router 4、Axios、Less/UnoCSS；版本以 `package.json` 和 `yarn.lock` 为准，不擅自升级或替换组件体系。
- 使用 Yarn，保留 `yarn.lock` 和 `patches/`；`postinstall` 执行 patch-package。安装前核对 `@crrc/crrc-web-packages` 的 `link:../crrc-web-packages` 本地依赖，缺失时报告依赖问题，不自行替换公共包。
- 入口为 `src/main.ts` → `src/bootstrap.ts`；复用 `src/layouts`、`src/components`、`src/utils/hooks`、`src/store`、`src/directives` 及平台登录、菜单、微应用能力。
- 新增 PLSM 页面统一放在 `src/views/plsm/`，接口与业务类型放在 `src/api/plsm/`，按模块分目录；这是新增代码约定，不表示模板已有这些业务页面。
- 遵守 `.editorconfig`、`.prettierrc`、`.eslintrc.js`，保持两空格、单引号及现有 Vue/TS 风格；避免无关全库格式化。

## 启动与验证

- 以 `package.json` 实际脚本为准：`yarn dev`（Vue CLI）、`yarn vite:dev`（Vite 开发）、`yarn build:test`、`yarn build:production`。README 中的 `serve/build` 不是当前脚本名。
- Vue CLI 是现有打包路径；Vite 开发可用不代表生产构建通过，不自行改成 Vite 打包。
- 环境沿用 `.env*`；Vue CLI 使用 `VUE_APP_*`，Vite 配置将 `VITE_APP_*` 映射到兼容变量，修改代理、项目代码、公共路径时核对两套配置及部署目录。
- 代码变更按影响执行 `yarn lint:check`、`yarn tsc` 和相关构建；检查用不自动修复命令，不用 `yarn prettier` 对全库重写。
- 分别报告静态检查、构建、页面操作和内网联调结果；既有模板错误与本次新增错误分开说明。缺少私有组件、网关、认证或菜单配置时明确阻断，不把 mock 当作真实联调。
- `publish:*` 脚本属于部署操作，不能作为本地验证命令自动执行。

## 接口与数据契约

- API 统一复用 `src/utils/request.ts`，保留认证、刷新令牌、项目请求头与语言参数；业务页面不新建绕开拦截器的 Axios 实例。
- 默认请求实例返回 HTTP body，并未自动提取业务结果。PLSM 的 `ResponseResult` 与模板 `ResponseBody` 可能存在 `msg/message`、数据字段差异，先核对实际序列化契约，在 PLSM API 层适配，不猜测或为单个模块全局改拦截器。
- 默认 POST/PUT 会转换为表单；调用后端 `@RequestBody` JSON 接口必须显式使用 `CONTENT_TYPE_APPLICATION_JSON`。上传使用 FormData，下载按实际响应使用 blob 或 `requestNative`。
- PLSM 列表分页接口使用 `pageNo/pageSize` 查询参数和 JSON 查询对象，返回 MyBatis-Plus 分页结构；核对 `records/total/current/size` 与模板 `rows/page` 的映射，不直接套模板分页类型。
- 网关服务前缀依据已确认路由配置设置；`src/api/typing.ts` 尚无 PLSM 服务项，接入时统一补充，不凭仓库名猜公网路径或硬编码内网地址。
- 数据库 ID 与业务编码分开；长 ID、物料号、序列号、位置及两位车辆序号保留字符串语义和前导零，避免 JavaScript 数值精度损失。
- 区分未传、null、空字符串，按具体接口决定保留或清空；不可批量把空表单字段统一转 null。错误须保留后端真实原因，避免失败仍提示成功或重复弹窗。

## 菜单、权限与业务边界

- 业务菜单复用 `src/router/generator-routers.ts` 的平台动态菜单；组件路径相对 `src/views` 且不带 `.vue`，例如 `plsm/<module>/index`。交付新页面时同时提供功能编码、路径、组件、路由名称及角色配置清单。
- 按钮展示复用已有权限工具；身份、数据范围、导出、批量修改和重发权限必须由服务端校验，前端隐藏不能替代授权。
- PLSM 四类基础数据为规划、规划位置、实车状态、序列号明细；页面操作应复用后端业务规则，不能用前端规则覆盖 PDM/MOM/MRO 数据归属。
- MOM 任务页若新增，必须分别显示 MOM/PLSM 结果及未知状态，重发使用后端原始报文快照；不得将部分成功显示为全部回滚。既有任务接口无额外专用令牌，不能自行恢复已取消的令牌机制，也不能据此绕过网关认证。
- 修改对接相关展示或维护功能前，核对后端 `service/sync`、`service/srm` 与当前部署说明；历史方案与代码冲突时以用户最终确认和现行实现为依据。
