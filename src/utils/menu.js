import { getRequest } from "./api"

export const initMenu = (router, store) => {
  if(store.state.routes.length > 0) {
    return  
  }
  if(store.state.token) {
    let token = {
      'key': 'bearer',
      'value': store.state.token
    }
    getRequest('/api/admin/sysAuthority/userMenuTree', token).then(resp => {
      if(resp && resp.success) {
        let user = resp.data.user
        let menus = resp.data.menus
        store.commit('login', user);
        let routes = []
        let menuTree = buildMenuTree(menus, routes)
        let home = {
          path: '/home',
          name: 'home',
          component: resolve => require(['@/views/home/index.vue'], resolve),
          children: routes
        }
        router.addRoutes([home]);
        store.commit('initMenu', menuTree);
      }
    })
  }
}

export const buildMenuTree = (menus, routes) => {
  let tree = []
  menus.forEach(menu => {
    tree.push(buildMenuNode(menu, routes))
  })
  return tree
}

export const buildMenuNode = (menu, routes) => {
  let children = []
  let others = []
  if (menu.children && menu.children instanceof Array) {
    menu.children.forEach(child => {
      // 是否菜单
      if (child.isMenu) {
        children.push(buildMenuNode(child, routes))
      } else {
        others.push(child)
      }
    })
  }
  let node = {
    path: menu.path,
    name: menu.name,
    iconCls: menu.icon,
    others: others,
    children: children
  }
  if (children.length == 0) {
    // 路由
    if (menu.url) {
      node.component = resolve => {
        require(['../views' + menu.url + '/index.vue'], resolve)
      }
    } else {
      node.component = resolve => {
        require(['../views/other/404.vue'], resolve)
      }
    }
    routes.push(node)
  }
  
  return node
}