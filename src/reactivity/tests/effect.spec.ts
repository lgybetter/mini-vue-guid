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

  it("should return runner when call effect", () => {
    // 当调用 runner 的时候可以重新执行 effect.run
    /**
     * runner 的返回值就是用户给的 fn 的返回值,
     * 和直接调用 add 函数的区别在于绑定的 this 上下文不一样
     */
    let foo = 0;
    const add = () => {
      console.log(this)
      foo++;
      return foo;
    }
    const runner = effect(add);

    expect(foo).toBe(1);
    add();
    expect(foo).toBe(2);
    runner();
    expect(foo).toBe(3);
    expect(runner()).toBe(4);
  });
})