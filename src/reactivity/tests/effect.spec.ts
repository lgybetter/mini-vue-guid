import { effect } from '../effect'
import { reactive } from '../reactive'

describe('effect', () => {
  it('happy path', () => {
    const user = reactive({
      age: 10,
    })

    let nextAage;
    effect(() => {
      // 触发 Proxy 的 get 方法, 进行 track 依赖收集
      nextAage = user.age + 1
    })

    expect(nextAage).toBe(11)

    // 触发 Proxy 的 set 方法, 修改数据并进行依赖分发触发
    user.age++
    expect(nextAage).toBe(12)
  })
})