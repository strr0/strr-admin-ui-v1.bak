const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  // 关闭语法检查
  lintOnSave: false,
  devServer: {
    proxy: {
      '/': {
        target: 'http://localhost:8081',
        changeOrigin: true,
        pathRewrite: {
          '^/': ''
        },
        ws: false
      }
    }
  }
})
