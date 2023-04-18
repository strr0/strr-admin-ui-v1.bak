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
    <!--  用户列表  -->
    <div style="margin-top: 10px">
      <el-table :data="userList" stripe border v-loading="loading" style="width: 100%"
        highlight-current-row @current-change="selectCurrentRow">
        <el-table-column type="selection" />
        <el-table-column prop="username" label="用户名" />
        <el-table-column prop="nickname" label="昵称" />
        <el-table-column prop="email" label="邮箱" />
        <el-table-column prop="avatar" label="用户头像" />
        <el-table-column prop="remark" label="描述" />
        <el-table-column prop="loginTime" label="登录时间" />
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
    <!--  查看  -->
    <div>
      <el-dialog :title="title" :visible.sync="showModalVisible" width="50%">
        <el-descriptions :column="2" border>
          <el-descriptions-item>
            <template slot="label">用户名</template>{{ user.username }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">昵称</template>{{ user.nickname }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">电子邮箱</template>{{ user.email }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">角色</template>
            <el-tag size="small"
              v-for="item in currentRoleList"
              :key="item.id"
            >
              {{ item.name }}
            </el-tag>
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">用户头像</template>{{ user.avatar }}
          </el-descriptions-item>
          <el-descriptions-item>
            <template slot="label">个人说明</template>{{ user.remark }}
          </el-descriptions-item>
        </el-descriptions>
      </el-dialog>
    </div>
    <!--  添加/修改  -->
    <div>
      <el-dialog :title="title" :visible.sync="editModalVisible" width="50%">
        <el-form :model="user" ref="user" :rules="rules" label-position="right" label-width="80px">
          <el-row>
            <el-col :span="12">
              <el-form-item prop="username" label="用户名">
                <el-input type="text" v-model="user.username" placeholder="请输入用户名"
                  prefix-icon="el-icon-edit" style="width: 80%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item prop="nickname" label="昵称">
                <el-input type="text" v-model="user.nickname" placeholder="请输入昵称"
                  prefix-icon="el-icon-edit" style="width: 80%" />
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item prop="email" label="电子邮箱">
                <el-input type="text" v-model="user.email" placeholder="请输入电子邮箱"
                  prefix-icon="el-icon-message" style="width: 80%" />
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="角色">
                <el-select v-model="newRids" multiple placeholder="请选择" style="width: 80%">
                  <el-option v-for="item in roleList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id" />
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-form-item prop="avatar" label="用户头像">
              <el-input v-model="user.avatar" placeholder="请上传用户头像" style="width: 90%" />
            </el-form-item>
          </el-row>
          <el-row>
            <el-form-item prop="remark" label="个人说明">
              <el-input type="textarea" v-model="user.remark" placeholder="请输入个人说明"
                style="width: 90%" />
            </el-form-item>
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
    name: 'User',
    data() {
      return {
        loading: false,
        page: 0,
        size: 10,
        total: 0,
        btnList: [],
        userList: [],
        roleList: [],
        title: '',
        showModalVisible: false,
        editModalVisible: false,
        user: {
          username: '',
          //password: '',
          nickname: '',
          email: '',
          avatar: '',
          remark: '',
          status: false
        },
        oldRids: [],
        newRids: [],
        rules: {
          username: [{required: true, message: '请输入用户名', trigger: 'blur'},
            {min: 4, max: 16, message: '长度必须是4-16个字符'}
          ],
          password: null,
          nickname: [{required: true, message: '请输入昵称', trigger: 'blur'}],
          email: [{required: true, message: '请输入电子邮箱', trigger: 'blur'},
            {type: 'email', message: '邮箱格式不正确', trigger: 'blur'}
          ],
          avatar: null,
          remark: null
        }
      }
    },
    computed: {
      currentRoleList() {
        return this.roleList.filter(item => this.oldRids.indexOf(item.id) != -1)
      },
      token() {
        return {
          'key': 'bearer',
          'value': this.$store.state.token
        }
      }
    },
    mounted() {
      this.initBtn()
      this.initUser()
      this.initRole()
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
        this.initUser()
      },
      initBtn() {
        this.btnList = this.$store.state.others
      },
      initUser() {
        this.loading = true
        let url = '/api/admin/sysUser/page?page=' + this.page + '&size=' + this.size
        this.getRequest(url, this.token).then(resp => {
          this.loading = false
          if(resp) {
            this.userList = resp.content
            this.total = resp.total
          }
        })
      },
      initRole() {
        this.getRequest('/api/admin/sysRole/list', this.token)
        .then(resp => {
          if(resp && resp.success) {
            this.roleList = resp.data
          }
        })
      },
      empty() {
        this.user = {
          username: '',
          //password: '',
          nickname: '',
          email: '',
          avatar: '',
          remark: '',
          status: false
        }
        this.oldRids = []
        this.newRids = []
      },
      save() {
        this.$refs.user.validate(valid => {
          if(valid) {
            let form = this.user
            delete form.loginTime
            form.oldRids = this.oldRids
            form.newRids = this.newRids
            this.postRequest('/api/admin/sysUser/saveInfo', form, this.token).then(resp => {
              if(resp && resp.success) {
                this.$message({
                  message: '保存成功',
                  type: 'success'
                })
                this.editModalVisible = false
                this.initUser()
              }
            })
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
        this.title = '查看用户信息'
        this.user = this.currentRow
        this.getRequest('/api/admin/sysUser/listRelByUid?uid=' + this.currentRow.id, this.token).then(resp => {
          if(resp && resp.success) {
            this.newRids = resp.data
          }
        })
        this.showModalVisible = true
      },
      //添加
      add() {
        this.title = '添加用户信息'
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
        this.title = '修改用户信息'
        this.user = this.currentRow
        this.getRequest('/api/admin/sysUser/listRelByUid?uid=' + this.currentRow.id, this.token).then(resp => {
          if(resp && resp.success) {
            this.newRids = resp.data
            this.oldRids = resp.data
          }
        })
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
          this.deleteRequest('/api/admin/sysUser/removeInfo?id=' + this.currentRow.id, this.token).then((resp) => {
            if (resp) {
              this.$message({
                message: '删除成功',
                type: 'success'
              })
              this.initUser()
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