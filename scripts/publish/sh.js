/*
 * sh.js
 * @Descripttion: shell命令
 */
const sh = require('shelljs');

/**
 * @description 执行shell命令
 * @param {String}params命令
 * @returns
 */
const exec = params => {
  return new Promise((resolve, reject) => {
    const code = sh.exec(params).code;
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  });
};

/**
 *
 * @description 查看当前路径
 * @returns
 */
const pwd = () => {
  return new Promise((resolve, reject) => {
    const { code, stdout } = sh.pwd();
    if (code !== 0) {
      reject();
    } else {
      console.log(stdout);
      resolve(stdout);
    }
  });
};

/**
 *
 * @description 进入文件夹
 * @param {String}params地址
 * @returns
 */
const cd = params => {
  return new Promise((resolve, reject) => {
    const code = sh.cd(params).code;
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  });
};

/**
 *
 * @description 移动文件
 * @param {String}
 * @returns
 */
const mv = (p1, p2) => {
  return new Promise((resolve, reject) => {
    const code = sh.mv(p1, p2).code;
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  });
};

/**
 *
 * @description 复制文件
 * @param {String}
 * @returns
 */
const cp = (p1, p2) => {
  return new Promise((resolve, reject) => {
    const code = sh.cp('-r', p1, p2).code;
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  });
};

/**
 * @description删除操作
 * @param {String}params 文件或文件夹名字
 * @returns
 */
const rm = params => {
  return new Promise((resolve, reject) => {
    const code = sh.rm('-rf', params).code;
    if (code !== 0) {
      reject();
    } else {
      resolve();
    }
  });
};

module.exports = { exec, pwd, cd, mv, cp, rm };
