/** 规划、位置和档案共用生效字典；未知值用灰色，不能把缺失状态误标成有效或失效。 */
export function effectiveColor(status?: string) {
  return { '1': 'green', '0': 'red' }[status || ''] || 'default';
}

/** 实车字典不同：0上车为绿色，1下车和2作废为红色，不能直接套用生效字典。 */
export function vehicleColor(status?: string) {
  return { '0': 'green', '1': 'red', '2': 'red' }[status || ''] || 'default';
}
