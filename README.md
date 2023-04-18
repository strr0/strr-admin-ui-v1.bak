## strr-admin-ui

### 项目介绍
- strr-admin前端页面

### 使用
1. 拉取代码
```
git clone https://github.com/strr0/strr-admin-ui.git
```
2. 新建项目引入依赖
```
yarn add ../strr-admin-ui
```
3. 修改配置
```
App.vue
<template>
  <div id="app">
    <router-view/>
  </div>
</template>

<style>
body {
  margin: 0;
}
</style>
```
```
main.js
import App from './App.vue'
import { Vue, router, store } from 'strr-admin-ui'

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
```
```
vue.config.js
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
```