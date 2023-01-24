/**
 *
 * @param { Function } fn 函数
 * @returns
 */
export function nextTick(fn: Function) {
  return new Promise(resolve => setTimeout(() => resolve(fn()), 0))
}
