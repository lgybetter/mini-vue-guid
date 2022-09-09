export function createComponentInstance(vnode) {
  const component = {
    vnode,
    type: vnode.type,
  }
  return component
}

export function setupComponent(instance) {
  setupStatefulComponent(instance)
}

function setupStatefulComponent(instance) {
  const Component = instance.type

  const { steup } = Component

  if (steup) {
    const steupResult = steup();

    handleSetupResult(instance, steupResult)
  }
}

function handleSetupResult(instance, steupResult) {
  if (typeof steupResult === 'object') {
    instance.steupState = steupResult
  }

  finishComponentSetup(instance)
}

function finishComponentSetup(instance) {
  const Component = instance.type

  if (!Component.render) {
    instance.render = Component.render
  }
}
