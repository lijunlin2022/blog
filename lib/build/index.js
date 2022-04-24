const { readdirSync, statSync, writeFileSync, readFileSync, mkdirSync, existsSync } = require('fs')
const path = require('path')
const process = require('process')
const template = require('art-template')
const hljs = require('highlight.js')
const md = require('markdown-it')({
  html: true,
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

let contentsObj = {
  html: ''
}

md.use(require('markdown-it-mark'))
  .use(require('markdown-it-textual-uml'))
  .use(require('markdown-it-anchor').default)
  .use(require('markdown-it-sub'))
  .use(require('markdown-it-sup'))
  .use(require('markdown-it-copy'))
  .use(require('@neilsustc/markdown-it-katex'))
  .use(require('markdown-it-task-lists'))
  .use(require('../utils/markdown-it-table-of-contents'), {
    includeLevel: [1, 2],
    markerPattern: /^\[toc\]/im
  }, contentsObj)

const generateHtml = (dirPath) => {
  // 根据路径读取文件, 返回文件列表
  const names = readdirSync(dirPath)
  for (let i = 0; i < names.length; i++) {
    const itemPath = path.join(dirPath, names[i])
    // 是文件
    if (statSync(itemPath).isFile()) {
      const newDirPath = dirPath.replace('post', 'dist')
      const newItemPath = itemPath.replace('post', 'dist').replace('md', 'html').replace('README', 'index')
      if (!existsSync(newDirPath)) {
        mkdirSync(newDirPath)
      }
      const mdContent = readFileSync(itemPath, 'utf-8')
      const htmlContent = md.render(mdContent)
      const templateContent = readFileSync(path.join(process.cwd(), 'public/template/index.html'), 'utf-8')
      const generation = template.render(templateContent, {
        htmlContent,
        contents: contentsObj.html
      })
      writeFileSync(newItemPath, generation, 'utf-8')
      continue
    } else {
      // 是文件夹
      generateHtml(itemPath)
    }
  }
}

const generateStatic = (dirPath) => {
  // 根据路径读取文件, 返回文件列表
  const names = readdirSync(dirPath)
  for (let i = 0; i < names.length; i++) {
    const itemPath = path.join(dirPath, names[i])
    // 是文件
    if (statSync(itemPath).isFile()) {
      const newDirPath = dirPath.replace('public', 'dist')
      const newItemPath = itemPath.replace('public', 'dist')
      if (!existsSync(newDirPath)) {
        mkdirSync(newDirPath)
      }
      const content = readFileSync(itemPath, 'utf-8')
      writeFileSync(newItemPath, content, 'utf-8')
      continue
    } else {
    // 是文件夹
    generateStatic(itemPath)
    }
  }
}

module.exports = () => {
  // 处理 css 和 img 等静态资源, 方法是直接拷贝一份
  const staticPath = path.join(process.cwd(), 'public/static')
  generateStatic(staticPath)

  // 处理 md 文件
  generateHtml(path.join(process.cwd(), 'post'))
  console.log('build finish')
}
