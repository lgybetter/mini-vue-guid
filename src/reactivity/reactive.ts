import { isObject } from '../shared';
import {
  mutableHandlers,
  readonlyHandlers,
  shallowReadonlyHandlers,
} from './baseHandler';

import { IHandler, IValue } from './types'

export const enum ReactiveFlags {
  IS_REACTIVE = "__v_isReactive",
  IS_READONLY = "__v_isReadonly",
}

export function reactive<T>(raw: T): T {
  return createReactiveObject(raw, mutableHandlers)
}

export function readonly<T>(raw: T): T {
  return createReactiveObject(raw, readonlyHandlers)
}

export function shallowReadonly<T>(raw: T): T {
  return createReactiveObject(raw, shallowReadonlyHandlers);
}

export function isReactive<T extends IValue>(value: T): boolean {
  return !!value[ReactiveFlags.IS_REACTIVE];
}

export function isReadonly<T extends IValue>(value: T): boolean {
  return !!value[ReactiveFlags.IS_READONLY];
}

export function isProxy<T extends IValue>(value: T): boolean {
  return isReactive(value) || isReadonly(value)
}

function createReactiveObject<T>(target: T, baseHandler: IHandler): T {
  if (!isObject(target)) {
    console.warn(`target ${target} 必须是一个对象`);
    return target;
  }
  return new Proxy(target as Object, baseHandler) as T;
}
