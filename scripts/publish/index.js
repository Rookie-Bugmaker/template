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
  let gitLog = 'auto push at ' + new Date().toLocaleString();

  //部署环境
  const publishEnv = process.argv.length > 2 ? process.argv[2] : 'test';

  //部署仓库地址
  const gitPath = `http://172.22.212.45/workplace-new/web/build-${publishEnv}/workplace-web-base.git`;

  try {
    // await cd('../..');
    const startTime = new Date().getTime();
    await exec(`yarn build:${publishEnv}`);
    const endTime = new Date().getTime();

    const buildTime = ((endTime - startTime) / 1000).toFixed();
    gitLog += ` build-time: ${buildTime}s `;

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
    await exec(`git push`);
    await exec(`git pull origin master`);
    await exec(`git push -u origin master`);
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
