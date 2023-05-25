mdbook 默认并不支持使用 mermaid 画图。我们可以通过安装插件的方式，让 mdbook 支持这个功能。

（1）在 book.toml 中可以添加如下配置。

```toml
[preprocessor.mermaid]
command = "mdbook-mermaid"

[output.html]
additional-js = ["assets/mermaid.min.js", "assets/mermaid-init.js"]
```

[mdbook-mermaid](https://github.com/badboy/mdbook-mermaid) 是一个开源插件。

（2）拷贝 mermaid 到与 src 同级的 assets 文件夹中。

mermaid-init.js 用来初始化 mermaid，内容为：

```js
mermaid.initialize({ startOnLoad: true });
```

至于 mermaid.min.js，可以去 [mermaid 官网](https://mermaid.js.org/)，找到它的 [CDN 地址](https://cdn.jsdelivr.net/npm/mermaid@10.2.0/dist/mermaid.min.js) 拷贝。

之后重新运行 `mdbook serve` 命令，就可以看到 mdbook 已经支持 mermaid 画图功能了。
