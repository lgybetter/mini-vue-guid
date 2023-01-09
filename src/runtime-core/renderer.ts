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
    // 处理原生节点类型 vnode
    processElement(vnode, container)
  } else if (isObject(vnode.type)) {
    // 处理 vue 组件类型 vnode
    processComponent(vnode, container)
  }
}

function processElement (vnode, container) {
  mountElement(vnode, container); 
}

function mountElement(vnode, container) {
  // 渲染挂载节点
  const el = (vnode.el = document.createElement(vnode.type))

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

// 创建组件实例
function mountComponent(initialVNode, container) {
  const instance = createComponentInstance(initialVNode);
  
  // 初始化组件
  setupComponent(instance)

  // 初始化组件 effect
  setupRenderEffect(instance, initialVNode, container)
}

function setupRenderEffect (instance, initialVNode, container) {
  const { proxy } = instance

  // 把当前代理设置为 render 的 this 上下文
  const subTree = instance.render.call(proxy)

  // 递归渲染子组件树
  patch(subTree, container)

  initialVNode.el = subTree.el
}
