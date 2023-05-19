## 一个替换 npm 包的 Babel 插件

我们需要在构建时，将 JavaScript 文件中的一个 npm 包，替换为另一个 npm 包。为此我们可以使用编写这样一个 Babel 插件：

```js
const oldPackage = 'old-package'
const newPackage = 'new-package'

module.exports = function(babel) {
  const { types: t } = babel

  return {
    name: "replace-npm-package",
    visitor: {
      ImportDeclaration(path) {
        const source = path.node.source.value
        if (source === oldPackage) {
          path.node.source.value = newPackage
        }
      },
      CallExpression(path) {
        const callee = path.node.callee
        if (callee.name === 'require') {
          const arg = path.node.arguments[0]
          if (t.isStringLiteral(arg) && arg.value === oldPackage) {
            path.node.arguments[0] = t.stringLiteral(newPackage)
          }
        }
      }
    }
  }
}
```

## 从 Babel 插件的编写，看一下编写插件的工作原理

改写 npm 包的过程，其实是改写 Babel AST 树的过程。

当我们改写 AST 某个节点时，我们首先是要获取到这个节点，这个过程叫做 **访问**，这也是为什么我们编写的 Babel 插件中，有 `visitor` 这个对象的缘故。

`ImportDeclaration` 是 Babel 中用来处理 JavaScript 模块导入语句的节点类型，它只用于处理 `import` 语句，而不包括其他类型的导入语句。`ImportDeclaration` 节点中包含了一些属性，例如 `source` 属性用于表示导入的模块资源位置，而 `specifiers` 属性表示导入的变量绑定。通过访问 `ImportDeclaration` 节点，我们可以获取到导入的模块名并进行替换操作。

`CallExpression` 是 Babel 中用来处理函数调用语句的节点类型，它可以用于处理 `require` 语句。`CallExpression` 节点中包含了一些属性，例如 `callee` 属性用于表示被调用的函数，而 `arguments` 属性表示函数的参数列表。通过访问 `CallExpression` 节点，我们可以获取到被调用的函数名，并判断是否是 `require` 函数，如果是则可以进行替换操作。

至于 `isStringLiteral`，它是用于检查一个节点是否为字符串字面量节点类型。`stringLiteral` 则用于创建一个字符串字面量类型节点。
