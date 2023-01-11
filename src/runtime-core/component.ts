import { PublicInstanceProxyHandlers } from './componentPublicInstance'
import { initProps } from './componentProps';
import { shallowReadonly } from '../reactivity/reactive'

export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
    setupState: {},
    props: {},
  }
  return component
}

export function setupComponent(instance) {

  initProps(instance, instance.vnode.props);

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
    const setupResult = setup(shallowReadonly(instance.props));

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
