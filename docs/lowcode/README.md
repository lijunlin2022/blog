# 自动软件生成系统的研究与实践

一个现代化的软件，往往由三部分组成，分别是：

- 前端
- 网络请求
- 后端

一个软件系统要想实现自动化生成，则这三部分都需要实现自动化

这个课题无疑是复杂的，为了让过程更为简明清晰，笔者做了以下简化：

- 仅生成 `HTML` 部分元素，包括
  - 标题，即 `h1` 标签
  - 分割线，即 `hr` 标签
  - 按钮，即 `button` 标签
  - 单行文本框，即 `input` 标签，其 `type` 为 `text`
  - 多行文本框，即 `textarea` 标签
  
- 数据库使用 `IndexedDB`，该数据库有两个重要特点

  - 位于浏览器本地

    普通的软件由于数据库处于服务器上，因此必须采用网络请求传递数据。选取这个数据库，可以让我们排除自动生成网络请求代码的干扰

  - 是一个非关系型数据库，以类对象的方式存储数据

    普通的软件遵从面向对象基本原则，关系型数据库则有自己的数学理论，两个理论存在显著差别，为了解决这个不匹配的现象，业界大多使用了 ORM （Object Relational Mapping，对象关系映射）思想，这个思想单独拿出来也是一个大课题

    选取这个数据库，可以简化自动软件生成系统的理论研究

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

我们首先看一下在关系型数据库中如何区分数据和模型。

比如从 student 表中查询一个 id 为 1 的学生的名字，会有 SQL 语句如下：

```sql
SELECT name FROM student WHERE id = 1;
```

这里的 `name`，`student`，`id` 和 `1` 均是数据，而其他不变的结构则认为是模型。

至于 IndexedDB 这样的非关系型数据库，我们可以看一下它插入数据的代码：

```javascript
db
  .transaction([storeName], 'readwrite') // 事务对象
  .objectStore(storeName) // 仓库对象
  .add(data)
```

显然，`db` 和 `storeName` 以及 `data` 就是数据，其他不变的结构就是模型。

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
	"tag": "div",
    "children": [
        {
            "tag": "h1",
            "children": {
                "tag": "span",
                "text": "hello world"
            }
        },
        {
            "tag": "h1",
            "text": "this is json"
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

生成 HTML 后，我们可以下载配置的 JSON 文件和生成的 HTML 文件

### 4.2 IndexedDB 的 JSON Schema

```json
{
    "dbName": "student",
    "storeName": "user",
    "data": [
        {
            "uuid": "6d25a684-9558-11e9-aa94-efccd7a0659b",
            "name": "Mike",
            "age": 20
        },
        {
            "uuid": "def539e8-d298-4575-b769-b55d7637b51e",
            "name": "Tom",
            "age": 18
        }
    ]
}
```

## 5 面临的困难

然而即便如此，我们依旧面临着对接两部分的困难，两部分的 JSON Schema 是不一样的，我们又该怎么样才能够对接呢？

为此，我们不得不再简化目标，先做出两部分，然后再将两部分对接。