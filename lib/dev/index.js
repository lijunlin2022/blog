/**
 * 启动开发模式:
 * 1. 启动 Web 服务
 * 2. 预览 markdown 生成的网页
 */

 const Koa = require('koa')
 const Router = require('koa-router')
 const render = require('koa-art-template')
 const static = require('koa-static')
 const { readFileSync } = require('fs')
 const process = require('process')
 const path = require('path')
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
 
 module.exports = () => {
   const app = new Koa()
   const router = new Router()
 
   render(app, {
     root: path.join(process.cwd(), 'public/template'),
     extname: '.html',
     debug: process.env.NODE_ENV !== 'production'
   })
 
   router.get('(.*)', async (ctx, next) => {
     try {
       const originPath = ctx.params[0]
       const { dir, name, ext } = path.parse(originPath)
       if (ext === '' || ext === '.html') {
         const mdFilePath = `${path.join('post', dir, name)}.md`
         const mdContent = readFileSync(mdFilePath, 'utf-8')
         const htmlContent = md.render(mdContent)
         await ctx.render('index', {
           title: '标题',
           contents: contentsObj.html,
           htmlContent
         })
       }
     } catch (err) {
       console.log(err.message)
     }
   })
 
   app.use(static(path.join(process.cwd(), 'public')))
   app.use(router.routes())
   app.use(router.allowedMethods({}))
 
   // 全局处理错误
   app.listen(3000, () => {
     console.log('rainforest blog is running at 3000 port')
   })
 }
 