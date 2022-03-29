const { copyCode } = require('vuepress-plugin-copy-code2')


module.exports = {
  themeConfig: {
    // Public 文件路径
    logo: '/images/hero.jpg'
  },
  plugins: [
    copyCode({}),
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: 'Search',
          },
          '/zh/': {
            placeholder: '搜索',
          },
        },
      },
    ],
  ]
}