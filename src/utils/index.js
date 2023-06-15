export const isTwoDimensionalArray = (arr) => Array.isArray(arr) && arr.every((item) => Array.isArray(item))

export * from './date-util'
