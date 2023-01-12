import { createVNode } from '../vnode'

export function renderSlots(slots, name, props) {
  const slot = slots[name]

  if (slot) {
    if (typeof slot === 'function') {
      // TODO: 这里 createVNode 是不是必要的？ 
      return createVNode('div', {}, slot(props))
    }
  }
}
