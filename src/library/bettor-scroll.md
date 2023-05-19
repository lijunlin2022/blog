## BetterScroll [^1] 的基础使用

BetterScroll 的基本使用，有三个要注意的地方：

- BetterScroll 默认处理的是父容器第一个子元素的滚动。
- BetterScroll 处理滚动时，第一个子元素的高度必须超过父容器的高度，否则不能滚动。此外，父容器还必须设置 `overflow: hidden`，否则鼠标滚动和触碰滚动混用时，会出现问题。
- BetterScroll 初始化时，必须确保父元素和子元素的内容已经正确渲染。

这三个需要注意的地方，决定了我们 HTML、CSS 和 JavaScript 的写法。我们这里以 Vue 举例：

```html
<!--
  wrapper 是父容器，
  它的第一个子元素，也是唯一的子元素，就是 content
-->
<div class="wrapper" ref="wrapper">
  <div class="content">
    <div class="item">1</div>
    <div class="item">2</div>
    <div class="item">3</div>
    <div class="item">4</div>
    <div class="item">5</div>
    <div class="item">6</div>
    <div class="item">7</div>
    <div class="item">8</div>
  </div>
</div>
```

```css
* {
  padding: 0;
  margin: 0;
}
/* 父容器的高度是 400px，且设置了 overflow: hidden */
.wrapper {
  width: 400px;
  height: 400px;
  background-color: rgba(0, 0, 0, 0.7);
  overflow: hidden;
}
/* 子组件的高度是 800px，超过了父容器 */
.content {
  width: 200px;
  height: 800px;
}
.item {
  width: 200px;
  height: 99px;
  border-bottom: 1px solid #000;
  background-color: #f5f5f5;
}
```

```js
import BScroll from '@better-scroll/core'

export default {
  mounted() {
    // this.$nextTick 是 Vue 提供的异步函数，可以确保 DOM 元素已经渲染
    this.$nextTick(() => {
      this.scroll = new BScroll(this.$refs.wrapper, {})
    })
  }
}
```

## 参考资料

[^1]: [BetterScroll | GitHub](https://github.com/ustbhuangyi/better-scroll)
[^2]: [示例 | BetterScroll](https://better-scroll.github.io/docs/zh-CN/guide/#%E7%A4%BA%E4%BE%8B)
