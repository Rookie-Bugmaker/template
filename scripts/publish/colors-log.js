/** 表示重置终端颜色，使其在此之后不再继续成为所选颜色 */
const endPrefix = '\x1B[0m';

/** 转义序列，它将被您的终端拦截并指示它切换到红色。
 * \x1B是不可打印控制字符 的代码escape。
 * 仅处理颜色和样式的转义序列也称为 ANSI转义码 并且是标准化的，因此它们（应该）可以在任何平台上工作 */
const color = {
  bright: '\x1B[1m', // 亮色

  grey: '\x1B[2m', // 灰色

  italic: '\x1B[3m', // 斜体

  underline: '\x1B[4m', // 下划线

  reverse: '\x1B[7m', // 反向

  hidden: '\x1B[8m', // 隐藏

  black: '\x1B[30m', // 黑色

  red: '\x1B[31m', // 红色

  green: '\x1B[32m', // 绿色

  yellow: '\x1B[33m', // 黄色

  blue: '\x1B[34m', // 蓝色

  magenta: '\x1B[35m', // 品红

  cyan: '\x1B[36m', // 青色

  white: '\x1B[37m', // 白色

  blackBG: '\x1B[40m', // 背景色为黑色

  redBG: '\x1B[41m', // 背景色为红色

  greenBG: '\x1B[42m', // 背景色为绿色

  yellowBG: '\x1B[43m', // 背景色为黄色

  blueBG: '\x1B[44m', // 背景色为蓝色

  magentaBG: '\x1B[45m', // 背景色为品红

  cyanBG: '\x1B[46m', // 背景色为青色

  whiteBG: '\x1B[47m', // 背景色为白色
};

const colors = (c, str) => `${c} ${str} ${endPrefix}`;

const successColor = color.bright + color.white + color.greenBG;

const errorColor = color.bright + color.white + color.redBG;

const log = {
  success: str => console.log(colors(successColor, str)),
  error: str => console.log(colors(errorColor, str)),
};

module.exports = { colors, color, endPrefix, log, successColor, errorColor };
