<template>
  <div class="router-view-child">
    <!-- 工具条 -->
    <el-form :inline="true" :model="formInline" class="demo-form-inline">
      <el-form-item>
        <el-input v-model="formInline.keyword" placeholder="关键字" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-select class="user-search-selector" v-model="formInline.field" placeholder="搜索类型" clearable >
        <el-option-group label="基本信息">
          <el-option v-for="item in user_search_selector_common" :key="item.id" :label="item.label" :value="item.value">
            <span style="float: left">
              <svg-icon :icon-class="item.icon" />
            </span>
            <span style="margin-left:10px; color: #8492a6; font-size: 13px">{{item.label}}</span>
          </el-option>
        </el-option-group>
        <el-option-group label="账户状态">
          <el-option v-for="item in user_search_selector_special" :key="item.id" :label="item.label" :value="item.value">
            <span style="float: left">
              <svg-icon :icon-class="item.icon" />
            </span>
            <span style="margin-left:10px; color: #8492a6; font-size: 13px">{{item.label}}</span>
          </el-option>
        </el-option-group>
        </el-select>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="table_data_search">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-edit">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-download">导出</el-button>
      </el-form-item>
      <el-form-item style="float:right">
        <el-switch
          v-model="search_state"
          active-text="搜索开启"
          inactive-text="搜索关闭"
          :disabled="search_change_disable"
          @change="table_data_search_close">
        </el-switch>
      </el-form-item>
    </el-form>
    <!-- 数据表格 -->
    <el-table :data="user_table_data" :height="user_table_height" border style="width: 100%" v-loading="loading" element-loading-text="拼命加载中" highlight-current-row> 
      <el-table-column type="selection" align="center" fixed="left"></el-table-column>
      <span v-for="item in user_table_columns_data" :key="item.id">
        <el-table-column v-if="item.id === 5" :prop="item.prop" :label="item.label" :width="item.width" align="center">
          <template slot-scope="scope">
            <svg-icon icon-class="email" />
            <span style="margin-left: 5px">{{ scope.row.email }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.id === 6" :prop="item.prop" :label="item.label" :width="item.width" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.isEnabled === 1" class="el-icon-success" style="color:#67C23A"></i>
            <i v-else class="el-icon-error" style="color:#F56C6C"></i>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.id === 7" :prop="item.prop" :label="item.label" :width="item.width" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.isAccountExpired === 1" class="el-icon-success" style="color:#67C23A"></i>
            <i v-else class="el-icon-error" style="color:#F56C6C"></i>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.id === 8" :prop="item.prop" :label="item.label" :width="item.width" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.isCredentialsExpired === 1" class="el-icon-success" style="color:#67C23A"></i>
            <i v-else class="el-icon-error" style="color:#F56C6C"></i>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.id === 9" :prop="item.prop" :label="item.label" :width="item.width" align="center">
          <template slot-scope="scope">
            <i v-if="scope.row.isAccountLocked === 1" class="el-icon-success" style="color:#67C23A"></i>
            <i v-else class="el-icon-error" style="color:#F56C6C"></i>
          </template>
        </el-table-column>
        <el-table-column v-else-if="item.id === 12" :prop="item.prop" :label="item.label" :width="item.width" align="center">
          <template slot-scope="scope">
            <i class="el-icon-time"></i>
            <span style="margin-left: 5px">{{ scope.row.operateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column v-else :prop="item.prop" :label="item.label" :width="item.width" align="center"></el-table-column>
      </span>
    </el-table>
    <!-- 分页插件 -->
    <el-pagination
      class="user_role_mapper_el_pagination"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="user_table_curret_page"
      :page-sizes="user_table_page_sizes"
      :page-size="user_table_page_size"
      layout="total, sizes, prev, pager, next, jumper"
      :total="user_table_page_total">
    </el-pagination>
  </div>
</template>

<script>
  import { list, search } from '@/api/rbac'
  import { getToken } from '@/utils/auth'

  export default {
    data() {
      return {
        user_search_selector_common: [
          { id: 1, label: '用户名称', value: 'username', icon: 'role_user_apper_search_username' },
          { id: 2, label: '真实姓名', value: 'name', icon: 'role_user_apper_search_name' },
          { id: 3, label: '部门名称', value: 'dept_id', icon: 'role_user_apper_search_dept_id' },
          { id: 4, label: '用户性别', value: 'gender', icon: 'role_user_apper_search_gender' },
          { id: 5, label: '电子邮件', value: 'email', icon: 'role_user_apper_search_email' }
        ],
        user_search_selector_special: [
          { id: 1, label: '账户启用', value: 'is_enabled', icon: 'role_user_apper_search_is_enabled' },
          { id: 2, label: '账户过期', value: 'is_account_expired', icon: 'role_user_apper_search_is_account_expired' },
          { id: 3, label: '密码过期', value: 'is_credentials_expired', icon: 'role_user_apper_search_is_credentials_expired' },
          { id: 4, label: '账户锁定', value: 'is_account_locked', icon: 'role_user_apper_search_is_account_locked' }
        ],
        user_table_columns_data: [
          { id: 1, prop: 'username', label: '用户名', width: '100', align: 'center' },
          { id: 2, prop: 'name', label: '真实姓名', align: 'center' },
          { id: 3, prop: 'departmentName', label: '所属部门', align: 'center' },
          { id: 4, prop: 'genderName', label: '性别', align: 'center' },
          { id: 5, prop: 'email', label: '电子邮件', width: '220', align: 'center' },
          { id: 6, prop: 'isEnabled', label: '账户禁用', align: 'center' },
          { id: 7, prop: 'isAccountExpired', label: '账户过期', align: 'center' },
          { id: 8, prop: 'isCredentialsExpired', label: '密码过期', align: 'center' },
          { id: 9, prop: 'isAccountLocked', label: '账户锁定', align: 'center' },
          { id: 11, prop: 'operator', label: '创建人', align: 'center' },
          { id: 12, prop: 'operateTime', label: '创建时间', width: '200', align: 'center' },
          { id: 13, prop: 'operateIp', label: '创建IP', align: 'center', fixed: 'right' },
          { id: 10, prop: 'remark', label: '备注', align: 'center' }
        ],
        user_table_height: 300,
        user_table_page_size: 10,
        user_table_page_sizes: [10, 15, 20, 25],
        user_table_page_total: 0,
        user_table_curret_page: 1,
        user_table_data: [],
        search_state: false,
        search_change_disable: true,
        formInline: {
          keyword: '',
          field: ''
        },
        loading: false
      }
    },
    methods: {
      onSubmit() {
        console.log('submit!')
      },
      handleSizeChange(val) {
        this.user_table_page_size = val
        this.table_data_init()
      },
      handleCurrentChange(val) {
        this.user_table_curret_page = val
        this.table_data_init()
      },
      table_height_init() {
        this.user_table_height = document.documentElement.clientHeight - 235
      },
      table_data_init() {
        this.loading = true
        new Promise((resolve, reject) => {
          list(getToken(), this.user_table_curret_page - 1, this.user_table_page_size).then(response => {
            this.user_table_page_total = response.count
            this.user_table_data = response.data
            this.loading = false
            resolve()
          }).catch(error => {
            this.loading = false
            reject(error)
          })
        })
      },
      table_data_search() {
        const field = this.formInline.field
        const keyword = this.formInline.keyword
        if (field === '') {
          this.$message({
            showClose: true,
            message: '请选择搜索类型',
            type: 'warning',
            center: true
          })
          return false
        } else if (keyword === '') {
          this.$message({
            showClose: true,
            message: '请输入搜索关键词',
            type: 'warning',
            center: true
          })
          return false
        }
        new Promise((resolve, reject) => {
          search(getToken(), field, keyword).then(response => {
            this.loading = true
            this.user_table_page_total = response.count
            this.user_table_data = response.data
            this.search_state = true
            this.search_change_disable = false
            this.loading = false
            resolve()
          }).catch(error => {
            this.loading = false
            reject(error)
          })
        })
      },
      table_data_search_close() {
        this.user_table_curret_page = 1
        this.user_table_page_size = this.user_table_page_sizes[1]
        this.search_change_disable = true
        this.formInline.keyword = ''
        this.formInline.field = ''
        this.table_data_init()
      }
    },
    created: function() {
      this.table_height_init()
      this.table_data_init()
    }
  }
</script>

<style>

.router-view-child{
  margin: 20px;
}

.el-form--inline .el-form-item{
  margin-right: 0px;
}

.user-search-selector{
  width: 120px;
}

.user_role_mapper_el_pagination{
  margin-top: 20px;
}

</style>
