/* 验证平台菜单到组件加载器的链路，以及构建漏分包/漏入口资源时确实阻断交付。 */
const assert = require('assert');
const fs = require('fs');
const os = require('os');
const path = require('path');
const vm = require('vm');
const ts = require('typescript');
const { verifyBuild } = require('./verify-plsm-build');
const root = path.resolve(__dirname, '..');

function loadTs(file, resolve, extra = {}) {
  const source = fs.readFileSync(path.join(root, file), 'utf8');
  const compiled = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2020 },
  }).outputText;
  const exports = {};
  vm.runInNewContext(compiled, { exports, require: resolve, ...extra }, { filename: file });
  return exports;
}

async function main() {
  const loaded = [];
  const views = loadTs('src/router/view-components.ts', name => {
    // 不渲染Vue页面；记录真正选择的模块路径，防止又回到运行期的通配模块查找。
    assert(name.startsWith('@/views/plsm/'));
    assert(fs.existsSync(path.join(root, 'src', name.slice(2))));
    loaded.push(name);
    return { default: { name } };
  });
  const makeFunction = component => ({
    functionType: 'A',
    component,
    name: 'test',
    path: '/test',
    functionName: '测试功能',
  });
  const router = loadTs(
    'src/router/generator-routers.ts',
    name => {
      if (name === './view-components') {
        return views;
      }
      if (name === '@/utils/util') {
        return { duffDevice: (items, callback) => items.forEach(callback) };
      }
      return {};
    },
    {
      window: {
        microApp: {
          getData: () => ({
            appFunctions: [makeFunction('plsm/serial-part/index'), { functionType: 'B' }],
          }),
        },
      },
    },
  );
  const sub = router.generatorSubAppRouter();
  assert.strictEqual(sub.length, 1, '按钮权限不能生成页面路由');
  await sub[0].component();
  const menu = router.convertMenuToRoutes(
    [
      {
        menuId: 'leaf',
        parentId: 'folder',
        functionId: 'f',
        function: makeFunction('plsm/vehicle/index'),
      },
    ],
    'root',
  );
  await menu[0].component();
  await router
    .generator(
      [
        {
          id: 'legacy',
          parentId: 'root',
          component: 'plsm/serial-part/index',
          path: '/legacy',
        },
      ],
      'root',
    )[0]
    .component();
  await views.resolveViewComponent(' ./plsm/serial-part/index.vue ')();
  assert.strictEqual(loaded.filter(name => name.includes('/serial-part/')).length, 3);
  assert.strictEqual(loaded.filter(name => name.includes('/vehicle/')).length, 1);
  await assert.rejects(views.resolveViewComponent('plsm/unknown/index')(), /PLSM菜单组件未注册/);

  const temp = fs.mkdtempSync(path.join(os.tmpdir(), 'plsm-build-check-'));
  try {
    const dist = path.join(temp, 'dist');
    fs.mkdirSync(path.join(dist, 'js'), { recursive: true });
    fs.writeFileSync(
      path.join(dist, 'index.html'),
      '<script src="/sub/plsm/js/app.123.js"></script>',
    );
    assert.throws(() => verifyBuild(temp), /缺少页面分包/);
    for (const name of ['plsm-serial-part.123.js', 'plsm-vehicle.123.js']) {
      fs.writeFileSync(path.join(dist, 'js', name), '测试页面分包');
    }
    assert.throws(() => verifyBuild(temp), /引用资源缺失/);
    fs.writeFileSync(path.join(dist, 'js/app.123.js'), '测试入口');
    const release = verifyBuild(temp);
    assert.strictEqual(release.containerPort, 29876);
    assert.strictEqual(release.files.length, 4);
    assert.strictEqual(release.buildId, verifyBuild(temp).buildId, '同批文件的发布标识必须稳定');
  } finally {
    // 只清理由本测试创建的临时目录，拒绝删除临时根目录之外的路径。
    assert(
      path.resolve(temp).startsWith(path.resolve(os.tmpdir()) + path.sep + 'plsm-build-check-'),
    );
    fs.rmSync(temp, { recursive: true, force: true });
  }
  console.log('PLSM菜单加载、组件路径兼容、权限按钮过滤及构建缺失文件回归通过');
}

main().catch(error => {
  console.error(error);
  process.exitCode = 1;
});
