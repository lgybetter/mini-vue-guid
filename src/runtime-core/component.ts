import { PublicInstanceProxyHandlers } from './componentPublicInstance'

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
  }
  return component
}

export function setupComponent(instance) {
  setupStatefulComponent(instance)
}

// 处理组件 setup 方法
function setupStatefulComponent(instance) {
  const Component = instance.type

  instance.proxy = new Proxy({
    _: instance,
  }, PublicInstanceProxyHandlers)

  const { setup } = Component
  if (setup) {
    const setupResult = setup();

    handleSetupResult(instance, setupResult)
  }
}

function handleSetupResult(instance, setupResult) {
  if (typeof setupResult === 'object') {
    instance.setupState = setupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  // 组件类型 type 为当前组件原型
  const Component = instance.type

  instance.render = Component.render
}
