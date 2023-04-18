<template>
  <el-menu
    :default-active="active"
    mode="horizontal"
    background-color="#545c64"
    text-color="#fff"
    active-text-color="#ffd04b">
    <el-menu-item v-for="(item, index) in items" :key="index" :index="index + ''" @click="handleSelect(item)">
      {{ item.name }}
    </el-menu-item>
  </el-menu>
</template>

<script>
export default {
  props: {
    items: {
      type: Array,
      default: () => {
        return []
      }
    },
    active: {
      type: String,
      default: null
    }
  },
  methods: {
    handleSelect(item) {
      this.$emit('showSub', item)
    }
  }
}
</script>

<style scoped>
.el-menu-item {
  float: right;
}
</style>