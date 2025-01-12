/**
 *
 * @param { any[] } array 数组
 * @param { Function } iterator 迭代数组函数
 * @returns 结果的个数
 */
export function countBy<T extends Record<string, any>>(
  array: T[],
  iterator: (item: T) => any,
) {
  return array.reduce((result, item) => {
    const val = iterator(item)
    if (!result[val])
      result[val] = 1
    else result[val]++
    return result
  }, {} as Record<string, number>)
}

// const array = [
//   { 'user': '1', 'active': true },
//   { 'user': '2', 'active': false },
//   { 'user': '3', 'active': true },
//   { 'user': '4', 'active': true },
//   { 'user': '5', 'active': true },
// ]
// console.log(countBy(array, (item) => {
//   return item.active
// })) // { true: 4, false: 1 }
