/**
 * 参考: https://wumanho.cn/posts/vueshapeflags/
 * 参考: https://www.jianshu.com/p/142fb05d0297
 */
export const enum ShapeFlags {
  ELEMENT = 1, // 0001 HTML
  STATEFUL_COMPONENT = 1 << 1,  // 00010 普通组件
  TEXT_CHILDREN = 1 << 2,       // 00100 子节点是纯文本
  ARRAY_CHILDREN = 1 << 3,      // 01000 子节点是数组
  SLOT_CHILDREN = 1 << 4,       // 10000 子节点为 slot
}

// 或运算 a | b ，对比每一个比特位，当同一位上的数有一个为1，结果就为1，否则结果为0
// 与运算 a & b ，对比每一个比特位，当同一位上的数都为1，结果才为1，否则结果为0

// (0001 | 0100) =>  0101  HTML 子节点是纯文本
// (0001 | 1000) =>  1001  HTML 子节点是数组

// (0010 | 0100) =>  0110  组件 子节点是纯文本
// (0010 | 1000) =>  1010  组件 子节点是数组
