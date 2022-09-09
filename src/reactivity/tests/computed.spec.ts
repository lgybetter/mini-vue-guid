import { reactive } from '../reactive'
import { computed } from '../computed'

describe('computed', () => {
  it('happy path', () => {

    const user = reactive({
      age: 1
    })

    const age = computed(() => {
      return user.age
    })

    expect(age.value).toBe(1)

    user.age = 2;
    expect(age.value).toBe(2)
  })

  it('should compute lazily', () => {
    const value = reactive({
      foo: 1
    })

    const getter = jest.fn(() => {
      return value.foo
    })

    const cValue = computed(getter)

    expect(getter).not.toHaveBeenCalled()

    expect(cValue.value).toBe(1)
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute again
    cValue.value
    expect(getter).toHaveBeenCalledTimes(1)

    // should not compute until needed
    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(1)

    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(2)

    cValue.value
    expect(getter).toHaveBeenCalledTimes(2)

    value.foo = 2;
    expect(getter).toHaveBeenCalledTimes(2)
    expect(cValue.value).toBe(2)
    expect(getter).toHaveBeenCalledTimes(3)
  })
})
