/**
 * 将公式字符串解析为对象
 * @param str 公式
 */
export const parseExpressionString = (str: string) => {
  const tokens = [];

  // /(\$.*?\!\$)|(\&.*?\!\&)|(数量)/g;
  const regex = /(\$.*?!\$)|(&.*?!&)|(数量)/g;
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(str)) !== null) {
    // 处理匹配前的普通文本
    if (match.index > lastIndex) {
      tokens.push(str.substring(lastIndex, match.index));
    }

    const fullMatch = match[0];

    // 处理 $...!$ 模式
    if (fullMatch.startsWith('$')) {
      const desc = fullMatch.substring(1, fullMatch.length - 2);
      tokens.push({ type: 'number', desc, value: null });
    }
    // 处理 &...!& 模式
    else if (fullMatch.startsWith('&')) {
      const innerContent = fullMatch.substring(1, fullMatch.length - 2);
      const valueRegex = /(.*)<<([^>]*)>>$/;
      const valueMatch = innerContent.match(valueRegex);

      if (valueMatch) {
        tokens.push({
          type: 'fixedNumber',
          desc: valueMatch[1],
          value: valueMatch[2],
        });
      } else {
        tokens.push({
          type: 'fixedNumber',
          desc: innerContent,
          value: null,
        });
      }
    } else if (fullMatch == '数量') {
      tokens.push({ type: 'refNumber', desc: '数量', value: null });
    }

    lastIndex = regex.lastIndex;
  }

  // 添加剩余文本
  if (lastIndex < str.length) {
    tokens.push(str.substring(lastIndex));
  }

  return tokens;
};
