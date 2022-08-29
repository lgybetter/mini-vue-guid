import { hasChanged, isObject } from "../shared";
import { isTracking, trackEffects, triggerEffects, ReactiveEffect } from "./effect";
import { reactive } from "./reactive";
import { IProxyTarget } from "./types";

class RefImpl<T> {

  private _value: T;
  public dep;
  private _rawValue: T;
  public __v_isRef = true;

  constructor(value: T) {
    this._rawValue = value;
    this._value = convert(value);
    this.dep = new Set<ReactiveEffect>()
  }

  get value() {
    // 依赖收集
    trackRefValue(this)
    return this._value;
  }

  set value(newValue) {
    // 依赖更新派发
    if (hasChanged(newValue, this._rawValue)) {
      this._rawValue = newValue;
      this._value = convert(newValue);
      triggerEffects(this.dep);
    }
  }
}

function trackRefValue<T>(ref: RefImpl<T>) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

function convert<T>(value: T): T {
  return isObject(value) ? reactive(value) : value;
}

export function ref<T>(value: T): RefImpl<T> {
  return new RefImpl(value);
}

export function isRef<T>(ref: RefImpl<T> | T): ref is RefImpl<T> {
  return !!(ref as RefImpl<T>).__v_isRef
}

export function unRef<T>(ref: RefImpl<T> | T): RefImpl<T> | T {
  return isRef(ref) ? ref.value : ref;
}

export function proxyRefs<T extends Object>(objectWithRefs: T) {
  return new Proxy(objectWithRefs, {
    get(target, key) {
      return unRef(Reflect.get(target, key))
    },
    set<T>(target: IProxyTarget, key: string, value: T) {
      if (isRef(target[key]) && !isRef(value)) {
        return (target[key] as RefImpl<T>).value = value;
      } else {
        return Reflect.set(target, key, value)
      }
    }
  })
}