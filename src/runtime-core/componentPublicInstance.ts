import { hasOwn } from "../shared";

const publicPropertiesMap = {
  $el: i => i.vnode.el,
  $slots: i => i.slots,
}

export const PublicInstanceProxyHandlers = {
  get(target, key) {
    const { _: instance } = target;
    // setupState
    const { setupState, props } = instance
    // Object.hasOwnProperty vs in 
    // 参考: https://masteringjs.io/tutorials/fundamentals/hasownproperty
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }

    const publicGetter = publicPropertiesMap[key];
    if (publicGetter) {
      return publicGetter(instance)
    }
  }
}
