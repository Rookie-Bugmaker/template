/**
 * CRRC UI 主题切换工具
 *
 * 通过设置 html[data-theme] 属性切换全局主题。
 * 支持持久化到 localStorage。
 *
 * @example
 *   import { setTheme, getTheme } from '@/components/ckui/theme/theme-switcher'
 *   setTheme('red')   // 切换为红色主题
 *   setTheme('blue')  // 切换为蓝色主题
 *   getTheme()        // 获取当前主题
 */

const STORAGE_KEY = 'ck-theme';

/**
 * 设置当前主题
 * @param theme - 主题名称：'red'（CRRC品牌红） | 'blue'（备选蓝）
 */
export function setTheme(theme: 'red' | 'blue'): void {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem(STORAGE_KEY, theme);
}

/**
 * 获取当前主题
 * @returns 当前激活的主题名称，默认为 'blue'
 */
export function getTheme(): 'red' | 'blue' {
  return (localStorage.getItem(STORAGE_KEY) as 'red' | 'blue') || 'blue';
}

/**
 * 初始化主题（建议在 app 挂载前调用）
 * 自动从 localStorage 读取上次保存的主题，若不存在则使用蓝色主题
 */
export function initTheme(): void {
  setTheme(getTheme());
}
