import { ReactiveEffect } from "./effect"

export class ComputedRefImpl {
  private _dirty: boolean = true;
  private _effect: ReactiveEffect
  private _value: any

  constructor (getter: Function) {
    this._effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true
      }
    })
  }

  get value() {
    /**
     * 如果 _dirty 为 false，表示数据并没有发生变化
     * 响应式数据并没有触发 ReactiveEffect 的 scheduler 的执行
     * 表示响应式数据并没有执行 setter 方法，没有进行依赖的派发
     */
    if (this._dirty) {
      this._dirty = false
      this._value = this._effect.run();
    }
    return this._value
  }

}

export function computed(getter: Function) {
  return new ComputedRefImpl(getter)
}