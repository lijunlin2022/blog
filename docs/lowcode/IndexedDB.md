# IndexedDB 的使用

IndexedDB 主要用来客户端存储大量数据。它是按照域名分配独立空间。

一个独立域名下可以创建多个数据库，每个数据库下可以创建多个对象存储空间（表），一个对象存储空间可以存储多个对象数据。

<img src="./img/1.png" style="zoom: 67%;" />

IndexedDB 有以下特点：

- 非关系型数据库
- 持久化存储
- 异步操作
- 支持事务
- 同源策略
- 存储容量大

## 1 IndexedDB 的四个概念

- 仓库 ObjectStore
- 索引 index
- 游标 cursor
- 事务

indexedDB 没有表的概念，它只有仓库 store 的概念，把仓库理解为表就可以了

可以给对应的表添加索引，以便加快查找速率

游标可以想象为一个指针

对数据库进行操作时，如果失败了，就会回滚到最初的状态

## 2 实操

### 2.1 创建或连接数据库

```js
/**
 * 打开数据库
 * @param {object} dbName 数据库的名字
 * @param {string} storeName 仓库名称
 * @param {string} version 数据库的版本
 * @return {object} 该函数会返回一个数据库实例
 */
function openDB(dbName, version = 1) {
  return new Promise((resolve, reject) => {
    //  兼容浏览器
    var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
    let db
    // 打开数据库，若没有则会创建
    const request = indexedDB.open(dbName, version)
    // 数据库打开成功回调
    request.onsuccess = function (event) {
      db = event.target.result // 数据库对象
      console.log('数据库打开成功')
      resolve(db)
    }
    // 数据库打开失败的回调
    request.onerror = function (event) {
      console.log('数据库打开报错')
    }
    // 数据库有更新时候的回调
    request.onupgradeneeded = function (event) {
      // 数据库创建或升级的时候会触发
      console.log('onupgradeneeded')
      db = event.target.result // 数据库对象
      var objectStore
      // 创建存储库
      objectStore = db.createObjectStore('users', {
        keyPath: 'uuid', // 这是主键
        // autoIncrement: true // 实现自增
      })
      // 创建索引，在后面查询数据的时候可以根据索引查
      objectStore.createIndex('uuid', 'uuid', { unique: true })
      objectStore.createIndex('name', 'name', { unique: false })
      objectStore.createIndex('age', 'age', {
        unique: false,
      })
    }
  })
}

```

### 2.2 插入数据









