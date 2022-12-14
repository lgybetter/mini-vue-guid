import { extend, isObject } from '../shared';
import { track, trigger } from './effect'
import { reactive, ReactiveFlags, readonly } from './reactive';

const get = createGetter();
const set = createSetter();
const readonlyGet = createGetter(true);
const shallowReadonlyGet = createGetter(true, true)

function createGetter(isReadonly = false, shallow = false) {
  return function get(target: Object, key: string) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly;
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }

    const res = Reflect.get(target, key)

    if (shallow) {
      return res;
    }

    if (isObject(res)) {
      // 如果当前对象属性也是一个对象，则递归转换为响应式对象
      return isReadonly ? readonly(res) : reactive(res);
    }

    if (!isReadonly) {
      track(target, key)
    }

    return res;
  }
}

function createSetter() {
  return function set(target: Object, key: string, value: any) {
    const res = Reflect.set(target, key, value)

    trigger(target, key)

    return res;
  }
}

export const mutableHandlers = {
  get,
  set,
};

export const readonlyHandlers = {
  get: readonlyGet,
  set(target: Object, key: string) {
    console.warn(
      `key :"${String(key)}" set 失败，因为 target 是 readonly 类型`,
      target
    );

    return true;
  },
};

export const shallowReadonlyHandlers = extend({}, readonlyHandlers, {
  get: shallowReadonlyGet,
})