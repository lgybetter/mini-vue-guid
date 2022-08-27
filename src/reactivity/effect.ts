import { extend } from '../shared'

let activeEffect;
let shouldTrack = false;

class ReactiveEffect {
  private _fn: any;
  deps = [];
  active = true;
  onStop?: () => void;
  public scheduler: Function | undefined;

  constructor(fn, scheduler?: Function) {
    this._fn = fn;
    this.scheduler = scheduler
  }

  run() {
    if (!this.active) {
      return this._fn();
    }

    // 应该收集
    shouldTrack = true;
    activeEffect = this;
    const r = this._fn();

    // 重置
    shouldTrack = false;

    return r;
  }

  
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}

function cleanupEffect(effect) {
  effect.deps.forEach((dep: any) => {
    dep.delete(effect);
  });

  // 把 effect.deps 清空
  effect.deps.length = 0;
}

const targetMap = new Map()

export function track (target, key) {
  if (!isTracking()) return;

  // target(Map) -> key(Map) -> dep(Set)
  let depsMap = targetMap.get(target)
  if (!depsMap) {
    depsMap = new Map()
    targetMap.set(target, depsMap)
  }

  let dep = depsMap.get(key)
  if (!dep) {
    dep = new Set()
    depsMap.set(key, dep)
  }

   // 看看 dep 之前有没有添加过，添加过的话 那么就不添加了
  if (dep.has(activeEffect)) return;

  dep.add(activeEffect);
  activeEffect.deps.push(dep);
}

function isTracking() {
  return shouldTrack && activeEffect !== undefined;
}

export function trigger (target, key) {
  let depsMap = targetMap.get(target)
  let dep = depsMap.get(key)

  for (const effect of dep) {
    if (effect.scheduler) {
      effect.scheduler()
    } else {
      effect.run()
    }
  }
}

// type effectOptions = {
//   scheduler?: Function;
// };

export function effect(fn, options: any = {}) {
  const _effect = new ReactiveEffect(fn, options.scheduler)
  extend(_effect, options);

  /**
   * 触发 reactive 响应式对象的 get 拦截
   * get 触发 track 进行依赖收集
   * effect 回调函数中的响应式对象属性添加了当前的 ReactiveEffect 实例作为依赖
   */
  _effect.run();

  const runner: any = _effect.run.bind(_effect);
  runner.effect = _effect;

  return runner;
}

export function stop(runner) {
  runner.effect.stop();
}