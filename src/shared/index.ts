export const extend = Object.assign;

export function isObject<T>(value: T) {
  return value !== null && typeof value === 'object';
}

export function hasChanged<T>(val: T, newValue: T) {
  return !Object.is(val, newValue)
}