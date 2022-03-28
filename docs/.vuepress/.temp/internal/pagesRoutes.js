import { Vuepress } from '@vuepress/client/lib/components/Vuepress'

const routeItems = [
  ["v-8daa1a0e","/",{"title":"Hello VuePress"},["/index.html","/README.md"]],
  ["v-e7bce81e","/lowcode/IndexedDB.html",{"title":"IndexedDB 的使用"},["/lowcode/IndexedDB","/lowcode/IndexedDB.md"]],
  ["v-6a334b07","/lowcode/",{"title":"自动软件生成系统的研究与实践"},["/lowcode/index.html","/lowcode/README.md"]],
  ["v-3706649a","/404.html",{"title":""},["/404"]],
]

export const pagesRoutes = routeItems.reduce(
  (result, [name, path, meta, redirects]) => {
    result.push(
      {
        name,
        path,
        component: Vuepress,
        meta,
      },
      ...redirects.map((item) => ({
        path: item,
        redirect: path,
      }))
    )
    return result
  },
  [
    {
      name: "404",
      path: "/:catchAll(.*)",
      component: Vuepress,
    }
  ]
)
