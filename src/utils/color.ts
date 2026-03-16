/**
 * 根据给定的字符串生成一个随机但可预测的颜色值,并以十六进制形式返回
 * @param str
 * @returns HEX color
 */
export function stringToColor(str: string): string {
  if (!str) {
    return '#165eff';
  }
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  let color = '#';
  for (let i = 0; i < 3; i++) {
    //颜色调亮+50，最大值245
    const value = Math.min(245, ((hash >> (i * 8)) & 0xff) + 50);
    color += value.toString(16).padStart(2, '0');
  }
  return color;
}

/**
 * 根据背景颜色生成合适的字体颜色，检查背景颜色的亮度，然后选择对比度高的颜色作为字体颜色。如果背景颜色较暗，则使用白色（#FFFFFF）作为字体颜色；如果背景颜色较亮，则使用黑色（#000000）作为字体颜色
 * 函数首先将十六进制颜色转换为RGB值，然后计算亮度。亮度计算公式是基于人眼对不同颜色的敏感度，红色、绿色和蓝色的权重分别为299、587和114。最后，根据亮度值判断应该使用黑色还是白色作为字体颜色
 * @param hexColor
 * @returns "#000000" | "#FFFFFF"
 */
export function getContrastColor(hexColor: string): string {
  if (!hexColor) {
    return '#FFFFFF';
  }
  // 将十六进制颜色转换为 RGB 值
  const r = parseInt(hexColor.slice(1, 3), 16);
  const g = parseInt(hexColor.slice(3, 5), 16);
  const b = parseInt(hexColor.slice(5, 7), 16);

  // 计算颜色的亮度
  const brightness = (r * 299 + g * 587 + b * 114) / 1000;

  // 根据亮度返回字体颜色
  return brightness > 125 ? '#000000' : '#FFFFFF';
}
