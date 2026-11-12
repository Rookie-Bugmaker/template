/* 构建结束后校验PLSM页面分包与入口资源，并生成可通过HTTP核对的发布标识。 */
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const sha256 = value => crypto.createHash('sha256').update(value).digest('hex');

function verifyBuild(root) {
  const output = path.join(root, 'dist');
  const html = fs.readFileSync(path.join(output, 'index.html'), 'utf8');
  const scripts = fs.readdirSync(path.join(output, 'js'));
  const pages = ['plsm-serial-part', 'plsm-vehicle'];
  const assets = new Set(['index.html']);
  for (const page of pages) {
    const chunks = scripts.filter(name =>
      new RegExp(`^${page}(?:-legacy)?\\.[a-f0-9]+\\.js$`).test(name),
    );
    if (!chunks.length) {
      throw new Error(`PLSM构建缺少页面分包：${page}，请检查构建分支和源码是否完整`);
    }
    chunks.forEach(name => assets.add(`js/${name}`));
  }
  // 双版本入口中的普通脚本、兼容脚本及CSS都必须真实存在，不能只检查构建进程退出码。
  const references = html.matchAll(/(?:src|href)=["'](\/sub\/plsm\/[^"']+)["']/g);
  for (const match of references) {
    assets.add(match[1].slice('/sub/plsm/'.length).split(/[?#]/)[0]);
  }
  const files = Array.from(assets)
    .sort()
    .map(name => {
      const file = path.resolve(output, name);
      if (!file.startsWith(path.resolve(output) + path.sep) || !fs.existsSync(file)) {
        throw new Error(`PLSM入口引用资源缺失或路径异常：${name}`);
      }
      return { path: name, sha256: sha256(fs.readFileSync(file)) };
    });
  const release = {
    project: 'PLSM',
    builtAt: new Date().toISOString(),
    publicPath: '/sub/plsm/',
    containerPort: 29876,
    components: ['plsm/serial-part/index', 'plsm/vehicle/index'],
    // 发布标识由实际产物校验和生成，不依赖内网构建机器是否携带.git目录。
    buildId: sha256(JSON.stringify(files)).slice(0, 16),
    files,
  };
  fs.writeFileSync(path.join(output, 'plsm-release.json'), JSON.stringify(release, null, 2) + '\n');
  return release;
}

if (require.main === module) {
  const release = verifyBuild(path.resolve(__dirname, '..'));
  console.log(`PLSM产物校验通过，发布标识：${release.buildId}`);
}

module.exports = { verifyBuild };
