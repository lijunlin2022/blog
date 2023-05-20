实际开发中，有时我们希望子组件自行维护一个 state，而父组件可能通过调用子组件的方法，改变 state 的状态。

比如 Ant Design 的 Form 组件，我们可以通过 `FormInstance.getFieldsValue()` 或者 `FormInstance.setFieldsValue()` 来改变 Form 内部维护的 state。

此时我们需要使用到 `useRef()`，`useImperativeHandle` 和 `forwardRef` 等方法。下面是一段代码演示：

```jsx
// 父组件
import React, { useRef, useEffect } from 'react'

const Father = () => {
  const actionRef = useRef()
  
  useEffect(() => {
    // 调用子组件的方法
  	actionRef.current?.func()
  }, [])
  
  return <h1 ref={actionRef}>父组件</h1>
}
```

```jsx
// 子组件
import React, { useImperativeHandle, forwardRef } from 'react'

const Child = (props, ref) => {
  const func = () => {
    // ...
  }
  useImperativeHandle(ref => ({
    func
  }))
  return <h1>子组件</h1>
}

export default forwardRef(Child)
```
