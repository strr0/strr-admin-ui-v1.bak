<template>
  <el-container>
    <template v-if="item && item.children">
      <el-aside style="background: #ececec">
        <el-menu default-active="0" ref="bar" router>
          <sidebar :items="item.children" />
        </el-menu>
      </el-aside>
    </template>
    <el-main>
      <el-breadcrumb separator-class="el-icon-arrow-right">
        <el-breadcrumb-item>{{ item ? item.name : '' }}</el-breadcrumb-item>
        <el-breadcrumb-item v-text="this.$router.currentRoute.name"></el-breadcrumb-item>
      </el-breadcrumb>
      <router-view />
    </el-main>
  </el-container>
</template>

<script>
import sidebar from './sidebar.vue'
export default {
  components: { sidebar },
  props: {
    item: {
      type: Object,
      default: () => {}
    }
  },
  watch: {
    item: {
      handler (newV) {
        if (newV && newV.children && newV.children.length > 0) {
          var bar = this.$refs.bar
          if (bar) {
            bar.activeIndex = '0'
          }
        }
     },
      deep: true
    }
  },
  data() {
    return {
      active: null
    }
  },
  methods: {
  }
}
</script>

<style scoped>

</style>