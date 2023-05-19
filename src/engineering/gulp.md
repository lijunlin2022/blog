## 注入环境变量

在 package.json 的 scripts 中编写命令时，可以注入环境变量。

```json
{
  "scripts": {
    "dev:web": "PACKAGE_TYPE=web node index.js",
    "dev:wechat": "PACKAGE_TYPE=wechat node index.js"
  },
}
```

之后注入的环境变量，可以从 `process.env` 中直接取到。

```js
const { PACKAGE_TYPE } = process.env
```

## gulp3 和 gulp4 的区别[^1]

### 1 依赖陷阱

**gulp3 中，使用 task 方法，设置了依赖关系的同时，也设置了执行关系。**

举打包前端资源文件的例子：

- 依赖关系为：打包前端资源文件依赖打包 JavaScript 文件和打包 CSS 文件，而打包 CSS 文件有依赖清空文件夹
- 执行关系为：先情况文件夹，再并行执行打包 JavaScript 文件和 CSS 文件，最后打包前端资源文件

![](https://fettblog.eu/wp-content/uploads/2015/folie2.jpg)

```js
// 上述例子用 gulp3 代码表示如下

const { task } = require('task')

task('default', ['scripts', 'styles'], function() {...})

task('styles', ['clean'], function() {...})
task('scripts', ['clean'], function() {...})

task('clean', function() {...})
```

gulp4 中，`task` 的这个可选配置参数被取消了，`series` 和 `parallel` 是它的替代品。

- `series`，中文意思是「连续、一系列、串联」，它的参数是任意个函数，表示串行执行作为参数的任意个函数。
- `parallel`，中文意思是「平行、并联」，它的参数也是任意个函数，表示并行执行作为参数的任意个函数。

**但需要注意，gulp4 中，这两个函数只确定了执行关系，而没有确定依赖关系。**

```js
// 错误的 gulp4 代码

const { task, series, parallel } = require('task')

task('clean', function() {...})
task('styles', series('clean', function() {...}))
task('scripts', series('clean', function() {...}))

task('default', parallel('scripts', 'styles'))
```

使用这种写法，它会依赖两个 clean 任务，clean 任务会执行两次。这就是「依赖陷阱」。

![](https://fettblog.eu/wp-content/uploads/2015/folie3.jpg)

```js
// 正确的 gulp4 代码

const { task, series, parallel } = require('gulp')

task('styles', function() {...})

task('scripts', function() {...})

task('clean', function() {...})

task('default', series('clean', parallel('styles', 'scripts'), function() {...}))
```

之所以出现这样的差别，是因为 gulp3 会自动检测任务的依赖，如果有共同依赖任务，则只执行一次共同依赖任务；而 gulp4 中，则不会做这样的检查。

**因此，gulp3 中我们可以随意组合任务，但是 gulp4 我们最好在最后一步，才开始组合任务。这样能够让我们避免掉入 gulp4 的依赖陷阱中。**

### 2 run-sequence

gulp3 中，我们可以使用 run-sequence 这个插件，实现串行或者并行执行任务。

```js
const { task } = require('gulp')
const runSequence = require('run-sequence')

task('default', function(callback) {
  runSequence(
    ['clean'],
    ['styles', 'scripts'],
    callback
  )
})
```

不难看出，run-sequence 的功能已经被 series 和 parallel 给取代了。

## chokidar

chokidar 是一个用于文件系统监听的 JavaScript 库。在实际开发中，chokidar 通常用于监视源代码变化，并触发相应的构建或测试任务。

一下是一个使用 chokidar 的示例：

```js
const chokidar = require('chokidar')

chokidar.watch('.').on('all', (event, path) => {
  console.log(event, path)
})
```

这段代码将监听当前目录下的所有文件，并在触发任何事件（比如新增、修改等）时输出相应的时间和路径。

## 参考资料

[^1]: [Gulp 4: The new task execution system - gulp.parallel and gulp.series](https://fettblog.eu/gulp-4-parallel-and-series/)
