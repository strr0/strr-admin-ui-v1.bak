<template>
  <div>
    <template v-for="(item, index) in items">
      <el-submenu :key="index" :index="index+''" v-if="item.children && item.children.length > 0">
        <template slot="title">
          <i class="el-icon-menu"></i>
          <span>{{ item.name }}</span>
        </template>
        <sidebar :items="item.children" class="nest-menu" />
      </el-submenu>
      <el-menu-item :key="index" :index="index+''" :route="{path: item.path}" @click="handleClick(item)" v-else>
        <i class="el-icon-setting"></i>
        <span>{{ item.name }}</span>
      </el-menu-item>
    </template>
  </div>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  watch: {
    items: {
      handler (newV) {
        // 切换菜单勾选第一个二级菜单
        if (newV && newV.length > 0) {
          this.$router.push({path: newV[0].path})
        }
     },
      deep: true
    }
  },
  created() {
    // 默认勾选第一个二级菜单
    if (this.items && this.items.length > 0) {
      this.$router.push({path: this.items[0].path})
    }
  },
  methods: {
    handleClick(item) {
      this.$store.commit('setOthers', item.others)
    }
  }
}
</script>