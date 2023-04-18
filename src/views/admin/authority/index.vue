<template>
  <div>
    <div style="display: flex; justify-content: space-between; margin-top: 10px">
      <div>
        <el-input prefix-icon="el-icon-search" style="width: 350px; margin-right: 10px" />
        <el-button type="primary" icon="el-icon-search">搜索</el-button>
      </div>
      <div>
        <el-button v-for="item in btnList" :key="item.id" :type="item.type" :icon="item.icon" @click="handler(item.func)">
          {{ item.name }}
        </el-button>
      </div>
    </div>
    <!--  权限列表  -->
    <div style="margin-top: 10px">
      <el-table :data="authorityList" stripe border v-loading="loading" style="width: 100%"
        row-key="id" :tree-props="{ children: 'children', hasChildren: 'hasChildren' }"
        highlight-current-row @current-change="selectCurrentRow">
        <el-table-column type="selection" width="50" />
        <el-table-column prop="url" label="请求路径" />
        <el-table-column prop="path" label="路由地址" />
        <el-table-column prop="name" label="名称" />
        <el-table-column prop="component" label="组件" />
        <el-table-column label="图标">
          <template slot-scope="scope">
            <i :class="scope.row.icon" />
          </template>
        </el-table-column>
        <!-- <el-table-column prop="parentId" label="父菜单" /> -->
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" />
          </template>
        </el-table-column>
      </el-table>
    </div>
    <!--  查看  -->
    <div>
      <el-dialog :title="title" :visible.sync="showModalVisible" width="60%">
        <el-descriptions :column="2" border>
          <el-descriptions-item>
            <template slot="label">权限名称</template>{{ authority.name }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">路由地址</template>{{ authority.path }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">请求路径</template>{{ authority.url }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">图标</template><i :class="authority.icon" />
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">父菜单</template>{{ authority.parentName }}
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
    <!--  添加/修改  -->
    <div>
      <el-dialog :title="title" :visible.sync="editModalVisible" width="60%">
        <el-form :model="authority" ref="authority" :rules="rules" label-position="right" label-width="20%">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="权限名称">
                <el-input v-model="authority.name" placeholder="请输入权限名称"
                  prefix-icon="el-icon-edit" style="width: 80%" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="authority.isMenu">
              <el-form-item prop="path" label="路由地址">
                <el-input v-model="authority.path" placeholder="请输入路由地址"
                  prefix-icon="el-icon-edit" style="width: 80%" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="!authority.isMenu">
              <el-form-item prop="type" label="按钮类型">
                <el-select v-model="authority.type" placeholder="请选择" style="width: 80%">
                  <el-option
                    v-for="(item, index) in typeOptions"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12" v-show="authority.isMenu">
              <el-form-item prop="url" label="请求路径">
                <el-input v-model="authority.url" placeholder="请输入请求路径"
                  prefix-icon="el-icon-edit" style="width: 80%" />
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="!authority.isMenu">
              <el-form-item prop="icon" label="图标">
                <el-select v-model="authority.icon" placeholder="请选择" style="width: 80%">
                  <el-option
                    v-for="(item, index) in iconOptions"
                    :key="index"
                    :label="item"
                    :value="item"
                  >
                    <span class="span-l">{{ item }}</span><span class="span-r"><i :class="item" /></span>
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :span="12" v-show="!authority.isMenu">
              <el-form-item prop="func" label="方法">
                <el-input v-model="authority.func" placeholder="请输入方法"
                  prefix-icon="el-icon-edit" style="width: 80%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="父菜单">
                <el-input v-model="authority.parentName" style="width: 80%" readonly />
                <input v-model="authority.parentId" type="hidden" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="isMenu" label="是否菜单">
                <el-switch v-model="authority.isMenu" />
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <span slot="footer" class="dialog-footer">
          <el-button @click="editModalVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'AuthorityView',
    data() {
      return {
        loading: false,
        btnList: [],
        authorityList: [],
        title: '',
        showModalVisible: false,
        editModalVisible: false,
        typeOptions: ['primary', 'success', 'warning', 'danger'],
        iconOptions: ['el-icon-view', 'el-icon-plus', 'el-icon-edit', 'el-icon-delete'],
        authority: {
          url: '',
          path: '',
          name: '',
          component: '',
          icon: '',
          parentId: '',
          isMenu: true,
          type: '',
          func: '',
          status: 0
        },
        rules: {
          url: null,
          path: null,
          name: [{required: true, message: '请输入权限名称', trigger: 'blur'}],
          component: null,
          icon: null,
          parentId: null
        }
      }
    },
    computed: {
      token() {
        return {
          'key': 'bearer',
          'value': this.$store.state.token
        }
      }
    },
    mounted() {
      this.initBtn()
      this.initAuthority()
    },
    methods: {
      handler(func) {
        this[func]()
      },
      selectCurrentRow(val) {
        this.currentRow = val
      },
      initBtn() {
        this.btnList = this.$store.state.others
      },
      initAuthority() {
        this.loading = true
        this.getRequest('/api/admin/sysAuthority/menuTree', this.token).then(resp => {
          this.loading = false
          if(resp && resp.success) {
            this.authorityList = resp.data
            this.currentRow = null
          }
        })
      },
      empty() {
        this.authority = {
          url: '',
          path: '',
          name: '',
          component: '',
          iconCls: '',
          parentId: 0,
          isMenu: true,
          status: false
        }
      },
      save() {
        this.$refs.authority.validate(valid => {
          if(valid) {
            let form = this.authority
            delete form.children
            if (form.id) {
              this.putRequest('/api/admin/sysAuthority/update', this.authority, this.token).then(resp => {
                if(resp && resp.success) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.editModalVisible = false
                  this.initAuthority()
                }
              })
            } else {
              this.postRequest('/api/admin/sysAuthority/save', this.authority, this.token).then(resp => {
                if(resp && resp.success) {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.editModalVisible = false
                  this.initAuthority()
                }
              })
            }
            
          }
        })
      },
      //查看
      show() {
        if (this.currentRow == null) {
          this.$message({
            message: '请选择一项',
            type: 'warning'
          })
          return
        }
        this.title = '查看权限信息'
        this.authority = this.currentRow
        this.showModalVisible = true
      },
      //添加
      add() {
        this.title = '添加权限信息'
        this.empty()
        if (this.currentRow != null) {
          if (!this.currentRow.isMenu) {
            this.$message({
              message: '请选择菜单',
              type: 'warning'
            })
            return
          }
          this.authority.parentId = this.currentRow.id
          this.authority.parentName = this.currentRow.name
        } else {
          this.authority.parentName = ''
        }
        this.editModalVisible = true
      },
      //修改
      edit() {
        if (this.currentRow == null) {
          this.$message({
            message: '请选择一项',
            type: 'warning'
          })
          return
        }
        this.title = '修改权限信息'
        this.authority = this.currentRow
        this.editModalVisible = true
      },
      //删除
      del() {
        if (this.currentRow == null) {
          this.$message({
            message: '请选择一项',
            type: 'warning'
          })
          return
        }
        this.$confirm('此操作将永久删除此项, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.deleteRequest('/api/admin/sysAuthority/removeInfo?id=' + this.currentRow.id, this.token).then((resp) => {
            if (resp && resp.success) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.initAuthority()
            }
          })
        }).catch(() => {
          this.$message({
            message: '已取消',
            type: 'info'
          })
        })
      }
    }
  }
</script>

<style scoped>
.span-l {
  float: left;
}
.span-r {
  float: right;
}
</style>