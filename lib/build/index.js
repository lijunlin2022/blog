const { readdirSync, statSync, writeFileSync, readFileSync, mkdirSync, existsSync } = require('fs')
const path = require('path')
const process = require('process')
const template = require('art-template')
const hljs = require('highlight.js')
const md = require('markdown-it')({
  highlight: (str, lang) => {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs language-${lang}">` +
        hljs.highlight(str, { language: lang }).value +
        `</code></pre>`;
      } catch (__) { }
    }
    return ''
  }
})

const generateHtml = (dirPath) => {
  // 根据路径读取文件, 返回文件列表
  const names = readdirSync(dirPath)
  for (let i = 0; i < names.length; i++) {
    const itemPath = path.join(dirPath, names[i])
    // 是文件
    if (statSync(itemPath).isFile()) {
      const newDirPath = dirPath.replace('post', 'dist')
      const newItemPath = itemPath.replace('post', 'dist').replace('md', 'html')
      if (!existsSync(newDirPath)) {
        mkdirSync(newDirPath)
      }
      const mdContent = readFileSync(itemPath, 'utf-8')
      const htmlContent = md.render(mdContent)
      const templateContent = readFileSync(path.join(process.cwd(), 'static/template.html'), 'utf-8')
      const generation = template.render(templateContent, {
        htmlContent
      })
      writeFileSync(newItemPath, generation, 'utf-8')
      return
    }
    // 是文件夹
    generateHtml(itemPath)
  }
}

module.exports = () => {
  // 处理 css 和 img 等静态资源, 方法是直接拷贝一份
  const staticPath = path.join(pwd.join(process.cwd()))
  generateHtml(path.join(process.cwd(), 'post'))
  console.log('build finish')
}
