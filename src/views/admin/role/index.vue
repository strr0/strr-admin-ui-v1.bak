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
    <!--  角色列表  -->
    <div style="margin-top: 10px">
      <el-table :data="roleList" stripe border v-loading="loading" style="width: 100%"
        highlight-current-row @current-change="selectCurrentRow">
        <el-table-column type="selection" />
        <el-table-column prop="name" label="角色名称" />
        <el-table-column prop="remark" label="角色描述" />
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-switch v-model="scope.row.status" />
          </template>
        </el-table-column>
      </el-table>
      <el-pagination background
        @current-change="pageChange"
        layout="prev, pager, next, total"
        :total="total" />
    </div>
    <!--  添加/修改  -->
    <div>
      <el-dialog :title="title" :visible.sync="editModalVisible" width="60%">
        <el-form :model="role" ref="role" :rules="rules" label-position="left">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="name" label="角色名称">
                <el-input v-model="role.name" placeholder="请输入角色名称"
                  prefix-icon="el-icon-edit" style="width: 80%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="remark" label="角色描述">
                <el-input v-model="role.remark" placeholder="请输入角色描述"
                  prefix-icon="el-icon-edit" style="width: 80%" />
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
    <!--  权限控制  -->
    <div>
      <el-dialog :title="title" :visible.sync="allocModalVisible" width="60%">
        <el-tree
          show-checkbox
          node-key="id"
          ref="tree"
          :default-checked-keys="newAids"
          :data="treeData"
          :props="{ label: 'name', children: 'children' }" />
        <div style="display: flex; justify-content: flex-end">
          <el-button @click="cancelUpdate">取消修改</el-button>
          <el-button type="primary" @click="updateRel()">确认修改</el-button>
        </div>  
      </el-dialog>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RoleView',
    data() {
      return {
        //角色列表
        loading: false,
        page: 0,
        size: 10,
        total: 0,
        btnList: [],
        roleList: [],
        authorityList: [],
        //添加修改角色
        title: '',
        editModalVisible: false,
        allocModalVisible: false,
        role: {
          name: '',
          remark: '',
          status: false
        },
        treeData: [],
        oldAids: [],
        newAids: [],
        rules: {
          name: [{required: true, message: '请输入角色名称', trigger: 'blur'}],
          remark: [{required: true, message: '请输入角色描述', trigger: 'blur'}]
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
      this.initRole()
      this.initAuthority()
    },
    methods: {
      handler(func) {
        this[func]()
      },
      selectCurrentRow(val) {
        this.currentRow = val
      },
      pageChange(page) {
        this.page = page - 1
        this.initUser();
      },
      initBtn() {
        this.btnList = this.$store.state.others
      },
      initRole() {
        this.loading = true
        let url = '/api/admin/sysRole/page?page=' + this.page + '&size=' + this.size
        this.getRequest(url, this.token).then(resp => {
          this.loading = false
          if(resp) {
            this.roleList = resp.content
            this.total = resp.total
          }
        })
      },
      initAuthority() {
        this.getRequest('/api/admin/sysAuthority/menuTree', this.token)
        .then(resp => {
          if(resp && resp.success) {
            this.authorityList = resp.data
          }
        })
      },
      empty() {
        this.role = {
          name: '',
          remark: '',
          status: false
        }
        this.newAids = []
        this.oldAids = []
      },
      save() {
        this.$refs.role.validate(valid => {
          if(valid) {
            if (this.role.id) {
              this.putRequest('/api/admin/sysRole/update', this.role, this.token).then(resp => {
                if(resp && resp.success) {
                  this.$message({
                    message: '修改成功',
                    type: 'success'
                  })
                  this.editModalVisible = false
                  this.initRole()
                }
              })
            } else {
              this.postRequest('/api/admin/sysRole/save', this.role, this.token).then(resp => {
                if(resp && resp.success) {
                  this.$message({
                    message: '保存成功',
                    type: 'success'
                  })
                  this.editModalVisible = false
                  this.initRole()
                }
              })
            }
          }
        })
      },
      //权限控制
      alloc() {
        if (this.currentRow == null) {
          this.$message({
            message: '请选择一项',
            type: 'warning'
          })
          return
        }
        this.title = '权限控制'
        this.role = this.currentRow
        this.treeData = []
        this.getRequest('/api/admin/sysRole/listRelByRid?rid=' + this.role.id, this.token).then(resp => {
          if (resp && resp.success) {
            this.treeData = this.authorityList
            this.newAids = resp.data
            this.oldAids = resp.data
          }
        })
        this.allocModalVisible = true
      },
      //添加
      add() {
        this.title = '添加角色信息'
        this.empty()
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
        this.title = '修改角色信息'
        this.role = this.currentRow
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
          this.deleteRequest('/api/admin/sysRole/removeInfo?id=' + this.currentRow.id, this.token).then((resp) => {
            if (resp) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.initRole()
            }
          })
        }).catch(() => {
          this.$message({
            message: '已取消',
            type: 'info'
          })
        })
      },
      //修改权限
      updateRel() {
        let tree = this.$refs.tree
        let halfChecked = tree.getHalfCheckedKeys()
        let checked = tree.getCheckedKeys()
        let form = {}
        form.rid = this.role.id
        form.oldAids = this.oldAids
        form.newAids = halfChecked.concat(checked)
        this.postRequest('/api/admin/sysRole/updateRel', form, this.token).then(resp => {
          if(resp && resp.success) {
            this.$message({
              message: '修改成功',
              type: 'success'
            })
            this.currentRow = null
          }
        })
      },
      //取消
      cancelUpdate() {
        this.currentRow = null
        this.allocModalVisible = false
      }
    }
  }
</script>