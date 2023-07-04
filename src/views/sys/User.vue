<template>
	<div>
		<el-card shadow="never" style="display: flex;margin-bottom: 5px;height: 80px;">
		<el-form :inline="true" style="display: flex;">
			<el-form-item >
				<el-input
						v-model="searchForm.username"
						placeholder="用户名"
						clearable
				>
				</el-input>
			</el-form-item>

			<el-form-item>
				<el-button @click="getUserList">搜索</el-button>
			</el-form-item>

			<el-form-item>
				<!-- v-if="hasAuth('sys:user:save')" -->
				<el-button type="primary" @click="dialogVisible = true" >新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
				<!-- v-if="hasAuth('sys:user:delete')" -->
					<el-button type="danger" slot="reference" :disabled="delBtlStatu" >批量删除</el-button>
				</el-popconfirm>
			</el-form-item>
		</el-form>
		</el-card>

		<el-table
				ref="multipleTable"
				:data="tableData"
				tooltip-effect="dark"
        fit="true"

				border
        stripe
				@selection-change="handleSelectionChange">

      <el-table-column label="编号" width="80px" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(pageNum-1)*pageSize }}
        </template>
      </el-table-column>

			<el-table-column label="头像" align="center">
				<template slot-scope="scope">
					<el-avatar  :src="scope.row.avatar"></el-avatar>
				</template>
			</el-table-column>

			<el-table-column
					prop="username"
					label="用户名"
          align="center"
				>
			</el-table-column>
			<el-table-column
					prop="code"
					label="角色名称"
          align="center">
				<template slot-scope="scope">
					<el-tag  style="margin-top: 5px;" type="info" >{{scope.row.roles.name}}</el-tag>
				</template>
			</el-table-column>

			<el-table-column
					prop="statu"
					label="状态"
          align="center">
				<template slot-scope="scope">
					<el-tag  v-if="scope.row.enabledState === 0" type="success">正常</el-tag>
					<el-tag  v-else-if="scope.row.enabledState === 1" type="danger">禁用</el-tag>
				</template>

			</el-table-column>
			<el-table-column
					prop="created"
					label="创建时间"
          align="center"
			>
			</el-table-column>
			<el-table-column
					prop="icon"
					width="260px"
					label="操作"
          align="center">

				<template slot-scope="scope">
          <el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
          <el-divider direction="vertical"></el-divider>

<!--					<el-button type="text" @click="roleHandle(scope.row.id)">分配角色</el-button>-->
<!--					<el-divider direction="vertical"></el-divider>-->

					<el-button type="text" @click="repassHandle(scope.row.id, scope.row.username)">重置密码</el-button>
					<el-divider direction="vertical"></el-divider>



					<template>
						<el-popconfirm title="这是一段内容确定删除吗？" @confirm="delHandle(scope.row.id)">
							<el-button type="text" slot="reference">删除</el-button>
						</el-popconfirm>
					</template>

				</template>
			</el-table-column>

		</el-table>

		<el-pagination	
				@current-change="handleCurrentChange"
				layout="total, prev, pager, next"
				background
				:current-page="pageNum"
				:page-size="pageSize"
				:total="total">
		</el-pagination>


		<!--新增对话框-->
		<el-dialog
				title="提示"
				:visible.sync="dialogVisible"
				width="600px"
				:before-close="handleClose">

			<el-form :model="editForm" :rules="editFormRules" ref="editForm">
				<el-form-item label="用户名" prop="username" label-width="100px">
					<el-input v-model="editForm.username" autocomplete="off"></el-input>
					<el-alert
							title="初始密码为888888"
							:closable="false"
							type="info"
							style="line-height: 12px;"
					></el-alert>
				</el-form-item>

        <el-form-item label="权限"  prop="roles" label-width="100px">
        <el-select v-model="editForm.roles.id" placeholder="">
          <el-option
              v-for="item in roleTreeData"
              :key="item.id"
              :label="item.name"
              :value="item.id">
          </el-option>
        </el-select>
       </el-form-item>

				<el-form-item label="状态"  prop="statu" label-width="100px">
					<el-radio-group v-model="editForm.enabledState">
						<el-radio :label="0">正常</el-radio>
						<el-radio :label="1">停用</el-radio>
					</el-radio-group>
				</el-form-item>

			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click="handleClose">取 消</el-button>
				<el-button type="primary" @click="submitForm('editForm')">确 定</el-button>
			</div>
		</el-dialog>

		<!-- 分配权限对话框 -->
<!--		<el-dialog title="分配角色" :visible.sync="roleDialogFormVisible" width="600px">-->

<!--			<el-form :model="roleForm">-->
<!--				<el-tree-->
<!--						:data="roleTreeData"-->
<!--						show-checkbox-->
<!--						ref="roleTree"-->
<!--						:check-strictly=checkStrictly-->
<!--						node-key="id"-->
<!--						:default-expand-all=true-->
<!--						:props="defaultProps">-->
<!--				</el-tree>-->
<!--			</el-form>-->

<!--			<div slot="footer" class="dialog-footer">-->
<!--				<el-button @click="roleDialogFormVisible=false">取 消</el-button>-->
<!--				<el-button type="primary" @click="submitRoleHandle('roleForm')">确 定</el-button>-->
<!--			</div>-->
<!--		</el-dialog>-->

	</div>
</template>

<script>
import qs from "qs";
	export default {
		name: "Role",
		data() {
			return {
				searchForm: {},
				delBtlStatu: true,

				total: 0,
        pageSize: 10,
        pageNum: 1,

				dialogVisible: false,
				editForm: {
          id: '',
          username: "",
          avatar: "",
          created: "",
          updated: "",
          lastLogin: "",
          enabledState: '',
            roles:{}
				},
        role:{},

				tableData: [],

				editFormRules: {
					username: [
						{required: true, message: '请输入用户名称', trigger: 'blur'}
					],
					email: [
						{required: true, message: '请输入邮箱', trigger: 'blur'}
					],
					statu: [
						{required: false, message: '请选择状态', trigger: 'blur'}
					]
				},

				multipleSelection: [],

				roleDialogFormVisible: false,
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				roleForm: {},
				roleTreeData:  [],
				treeCheckedKeys: [],
				checkStrictly: true

			}
		},
		created() {
			this.getUserList()
      this.getRoleList()
		},
		methods: {
			toggleSelection(rows) {
				if (rows) {
					rows.forEach(row => {
						this.$refs.multipleTable.toggleRowSelection(row);
					});
				} else {
					this.$refs.multipleTable.clearSelection();
				}
			},
			handleSelectionChange(val) {
				
				this.multipleSelection = val;

				this.delBtlStatu = val.length == 0
			},

			// handleSizeChange(val) {
			// 	console.log(`每页 ${val} 条`);
			// 	this.size = val
			// 	this.getUserList()
			// },
			handleCurrentChange(val) {
				this.pageNum = val
				this.getUserList()
			},
      setPage(){
        this.searchForm.pageNum = this.pageNum
        this.searchForm.pageSize = this.pageSize
      }
      ,

			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.dialogVisible = false
				this.editForm = {}
			},

      //取消
			handleClose() {
				// this.resetForm('editForm')
        this.dialogVisible = false
        // this.editForm = {}
			},

      //获取用户列表
			getUserList() {
        this.searchForm.pageNum = this.pageNum
        this.searchForm.pageSize = this.pageSize
				this.$axios.get("/admin/list"+"?"+qs.stringify(this.searchForm)
				).then(res => {
					
					this.tableData = res.data.data.list
					this.pageSize = res.data.data.pageSize
					this.pageNum = res.data.data.pageNum
					this.total = res.data.data.total
				})
			},
      //获取角色列表
      getRoleList(){
        this.$axios.get("/admin/roleList").then(res =>{
          this.roleTreeData = res.data.data
        })
      },

      submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/sys/user/' + (this.editForm.id?'update' : 'save'), this.editForm)
							.then(res => {
								this.getUserList()
								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose:() => {
										
									}
								});

								this.dialogVisible = false
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
      //点击修改按钮处理
			editHandle(id) {
				this.$axios.get('/admin/info/' + id).then(res => {
          this.editForm = res.data.data
          this.role = res.data.data.roles
          console.log(this.editForm)
					this.dialogVisible = true
				})
			},
      //点击删除按钮处理
			delHandle(id) {
				var ids = []
				if (id) {
					ids.push(id)
				} else {
					this.multipleSelection.forEach(row => {
						ids.push(row.id)
					})
				}
				this.$axios.post("/sys/user/delete", ids).then(res => {
					this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose:() => {
							this.getUserList()
						}
					});
				})
			},

      //点击修改角色处理
			roleHandle (id) {
				this.roleDialogFormVisible = true

				this.$axios.get('/admin/info/' + id).then(res => {
					this.roleForm = res.data.data
					let roleIds = []	
					res.data.data.roles.forEach(row => {
						roleIds.push(row.id)
					})
					this.$refs.roleTree.setCheckedKeys(roleIds)
				})
			},
			submitRoleHandle(formName) {
				var roleIds = this.$refs.roleTree.getCheckedKeys()
				this.$axios.post('/sys/user/role/' + this.roleForm.id, roleIds).then(res => {
					this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose:() => {
							this.getUserList()
						}
					});

					this.roleDialogFormVisible = false
				})
			},
			repassHandle(id, username) {

				this.$confirm('将重置用户【' + username + '】的密码, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.$axios.post("/sys/user/repass", id).then(res => {
						this.$message({
							showClose: true,
							message: '恭喜你，操作成功',
							type: 'success',
							onClose: () => {
							}
						});
					})
				})
			}
		}
	}
</script>

<style scoped>

	.el-pagination {
		/* float: right; */
		margin-top: 22px;
	}

</style>