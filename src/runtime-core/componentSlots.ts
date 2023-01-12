import { ShapeFlags } from "../shared/ShapeFlags";

export function initSlots(instance, children) {
  const { vnode } = instance;

  if (vnode.shapeFlag & ShapeFlags.SLOT_CHILDREN) {
    normalizeObjectSlots(children, instance.slots);
  }
}

function normalizeObjectSlots(children: any, slots: any) {
  for(const key in children) {
    const value = children[key]
    // TODO: 这里 normalizeSlotValue 是不是必要的？直接返回 value(props)
    slots[key] = props => normalizeSlotValue(value(props))
  }
}

function normalizeSlotValue(value) {
  return Array.isArray(value) ? value : [value];
}
