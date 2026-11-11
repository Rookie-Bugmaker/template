/*
 * build.js
 * @Descripttion: 自动打包提交
 */
const { exec, cd, cp, rm } = require('./sh');
const { log } = require('./colors-log');

// 打包
const build = async () => {
  //打包目录
  const distDirName = 'dist';
  //临时存储仓库目录
  const tempDirName = 'temp';
  //commit message
  let gitLog = '部署：更新PLSM前端产物 ' + new Date().toLocaleString();

  //部署环境
  const publishEnv = process.argv.length > 2 ? process.argv[2] : 'test';

  //部署仓库地址
  // PLSM首次部署尚无已确认的产物仓库，必须显式指定，避免覆盖模板原来的主应用仓库。
  const gitPath = process.env.PLSM_DEPLOY_REPOSITORY;
  if (!gitPath) {
    log.error('请先设置PLSM_DEPLOY_REPOSITORY为PLSM专用产物仓库，再执行发布');
    return;
  }

  try {
    // await cd('../..');
    const startTime = new Date().getTime();
    await exec(`yarn build:${publishEnv}`);
    const endTime = new Date().getTime();

    const buildTime = ((endTime - startTime) / 1000).toFixed();
    gitLog += `，构建耗时：${buildTime}秒`;

    log.success('打包成功');
  } catch (error) {
    log.error('打包失败');
    return;
  }

  try {
    await cd('scripts/publish');
    await rm(`${tempDirName}`);
    await exec(`git clone ${gitPath} ${tempDirName}`);
    log.success('拉取部署仓库成功');
  } catch (error) {
    log.error('拉取部署仓库失败');
    return;
  }

  try {
    //清空仓库下的dist并复制打包好的dist
    await cd(`${tempDirName}`);
    await rm(`${distDirName}/*`);
    await cp(`../../../${distDirName}/*`, `${distDirName}/`);
    log.success('复制打包文件成功');
  } catch (error) {
    log.error('复制打包文件失败');
    return;
  }

  try {
    // await exec(`git status`);
    await exec(`git add .`);
    await exec(`git commit -m "${gitLog}"`);
    // 沿用PLSM专用产物仓库克隆后的默认跟踪分支，不再额外切换或推送模板master分支。
    await exec(`git push`);
    log.success('推送文件到部署环境成功');
  } catch (error) {
    log.error('推送文件到部署环境失败');
    return;
  }

  try {
    await cd(`..`);
    await rm(`${tempDirName}`);
    log.success('删除临时文件');
  } catch (error) {
    log.error('删除临时文件失败');
  }

  log.success('部署完成');
};

build();
