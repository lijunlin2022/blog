# 自动软件生成系统的研究与实践

一个现代化的软件，往往由三部分组成，分别是：

- 前端
- 网络请求
- 后端

一个软件系统要想实现自动化生成，则这三部分都需要实现自动化

这个课题无疑是复杂的，为了让过程更为简明清晰，笔者做了以下简化：

- 仅生成 `HTML` 部分元素，包括
  - 1-6 级标题，即 `h1` 到 `h6` 标签
  - 无序列表，即 `ul` 和 `li` 标签
  - 有序列表，即 `ol` 和 `li` 标签
  - 分割线，即 `hr` 标签
  - 按钮，即 `button` 标签
  - 单行文本框，即 `input` 标签，其 `type` 为 `text`
  - 多行文本框，即 `textarea` 标签
- 数据库使用浏览器自带的本地数据库 `IndexedDB`

由于数据库是浏览器本地的数据库，因此我们不必要关注网络请求；此外，由于 IndexedDB 是一个非关系型数据库，因此我们不必生成 SQL 语句，减轻了工作压力。

## 1 生成代码的原理

任何代码都可以看为两部分：

- 数据，数据能够改变
- 模型，模型保持不变

举例来说，这是一个 Hello World 程序：

```c
int main() {
	printf("Hello World");
    return 0;
}
```

我们可以认为，`Hello World` 这个字符串是数据，其他的代码都是模型。

如果我们想要一个生成一个能够输出字符串的 C 语言程序，我们只需要改变数据，而其他保持不变就可以了。

软件系统虽然很复杂，但我们仍旧可以将他们都看为这两部分。

## 2 生成 HTML 位置属性和样式标签

我们首先要区分，对一个 HTML 文件来说，什么是数据，什么是模型。

因为软件系统希望能够改变样式和位置，还能够选择不同的标签，所以 HTML 的标签、位置和样式都是数据。而模型就是它的结构，如下所示：

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>
<body>
</body>
</html>
```

 我们需要的，是把生成的 HTML 元素，塞到 body 标签中。

## 3 生成 IndexedDB 的增删改查语句

同样地，我们也要区分对 `IndexedDB` 来说，什么是数据，什么是模型。

考虑到多数人比较熟悉关系型数据库，我们先举例关系型数据库的例子。

比如从 student 表中查询一个 id 为 1 的学生的名字，会有 SQL 语句如下：

```sql
SELECT name FROM student WHERE id = 1;
```

这里的 `name`，`student`，`id` 和 `1` 均是数据，而其他不变的结构则认为是模型。

事实上，通过对象直接映射生成 SQL 语句的，已经有成熟的解决办法，称之为 `ORM` 框架。

## 4 使用 JSON 统一表示数据

在明白数据、模型的概念后，我们面临的一个问题是，如何恰当地表示数据，以方便我们和模型结合生成代码。经过调研发现，绝大部分的自动软件生成系统，都采取 `JSON` 作为中间格式。

采用 `JSON` 有以下优点：

- 结构简单
- 能够完整表达所需要的数据信息
- 和 JavaScript 配合非常良好

现在我们来规定 HTML 和 IndexedDB 的 JSON 格式。

### 4.1 HTML 的 JSON Schema

如何表示 HTML 的位置关系呢？目前有两种方法：

- 使用嵌套，用来表示 HTML 的树结构
- 不使用嵌套，而是直接使用 `top` 和 `left` 来直接定位元素

第一种方法如下所示：

```json
{
	tag: "div",
    children: [
        {
            tag: "h1",
            children: {
                tag: "span",
                text: "hello world"
            }
        },
        {
            tag: "h1",
            text: "this is json"
        }
    ]
}
```

第二种方法如下所示：

```json
{
    "tag": "div",
    "width": 550,
    "height": 550,
    "children": [
        {
            "tag": "button",
            "top": 100,
            "left": 100,
            "zIndex": 1,
            "text": "按钮",
            "backgroundColor": "red",
            "width": 100,
            "height": 100
		},
        {
        	"tag": "h1",
            "top": 100,
            "left": 200,
            "zIndex": 1
        }
    ]
}
```

简单起见，我们选择第二种办法，即使用 top 和 left 来确定 HTML 标签的位置关系。

### 4.2 IndexedDB 的 JSON Schema

## 5 总结

今天的内容就先写到这里