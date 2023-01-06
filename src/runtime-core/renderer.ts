import { isObject } from '../shared';
import { 
  createComponentInstance,
  setupComponent
} from './component'

export function render(vnode, container) {
  patch(vnode, container)
}

function patch(vnode, container) {
  if (typeof vnode.type === 'string') {
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    processComponent(vnode, container)
  }
}

function processElement (vnode, container) {
  mountElement(vnode, container); 
}

function mountElement(vnode, container) {
  const el = document.createElement(vnode.type)

  const { children } = vnode

  if (typeof children === "string") {
    // 子节点为文本
    el.textContent = children;
  } else if (Array.isArray(children)) {
    // 子节点为多个节点
    mountChildren(vnode, el);
  }

  // props
  const { props } = vnode;
  for (const key in props) {
    const val = props[key];
    el.setAttribute(key, val);
  }

  container.append(el);

}

function mountChildren (vnode, container) {
  // 多个节点循环递归渲染
  vnode.children.forEach((v) => {
    patch(v, container)
  })
}

function processComponent(vnode, container) {
  mountComponent(vnode, container)
}

function mountComponent(vnode, container) {
  const instance = createComponentInstance(vnode);
  setupComponent(instance)
  setupRenderEffect(instance, container)
}

function setupRenderEffect (instance, container) {

  const subTree = instance.render()

  patch(subTree, container)
}
