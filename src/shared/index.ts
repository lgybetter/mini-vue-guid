export const extend = Object.assign;

export function isObject<T>(value: T) {
  return value !== null && typeof value === 'object';
}

export function hasChanged<T>(val: T, newValue: T) {
  return !Object.is(val, newValue)
}

export function hasOwn<T> (val: T, key: string)  {
  return Object.prototype.hasOwnProperty.call(val, key);
}

export const camelize = (str: string) => {
  return str.replace(/-(\w)/g, (_, c: string) => {
    return c ? c.toUpperCase() : "";
  });
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const toHandlerKey = (str: string) => {
  return str ? "on" + capitalize(str) : "";
};
