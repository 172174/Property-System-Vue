<template>
	<div>
		<el-card shadow="never" style="display: flex;margin-bottom: 5px;height: 80px;">
		<el-form :inline="true">
			<el-form-item>
				<el-input
						v-model="searchForm.name"
						placeholder="名称"
						clearable
				>
				</el-input>
			</el-form-item>

			<el-form-item>
				<el-button @click="getRoleList">搜索</el-button>
			</el-form-item>

			<el-form-item>
				<el-button type="primary" @click="dialogVisible = true">新增</el-button>
			</el-form-item>
			<el-form-item>
				<el-popconfirm title="这是确定批量删除吗？" @confirm="delHandle(null)">
					<el-button type="danger" slot="reference" :disabled="delBtlStatu">批量删除</el-button>
				</el-popconfirm>
			</el-form-item>
		</el-form>
		 </el-card>

		<el-table
				ref="multipleTable"
				:data="tableData"
				tooltip-effect="dark"
				style="width: 100%"
				border
				stripe
				@selection-change="handleSelectionChange">

      <el-table-column label="编号" width="80px" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(pageNum-1)*pageSize }}
        </template>
      </el-table-column>

			<el-table-column
					prop="name"
					label="名称"
					width="120">
			</el-table-column>
			<el-table-column
					prop="code"
					label="唯一编码"
					show-overflow-tooltip>
			</el-table-column>
			<el-table-column
					prop="remark"
					label="描述"
					show-overflow-tooltip>
			</el-table-column>

			<el-table-column
					prop="statu"
					label="状态">
				<template slot-scope="scope">
					<el-tag size="small" v-if="scope.row.statu === 0" type="success">正常</el-tag>
					<el-tag size="small" v-else-if="scope.row.statu === 1" type="danger">禁用</el-tag>
				</template>

			</el-table-column>
			<el-table-column
					prop="icon"
					label="操作">

				<template slot-scope="scope">
					<el-button type="text" @click="permHandle(scope.row.id)">分配权限</el-button>
					<el-divider direction="vertical"></el-divider>

					<el-button type="text" @click="editHandle(scope.row.id)">编辑</el-button>
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
				@size-change="handleSizeChange"
				@current-change="handleCurrentChange"
				layout="total,  prev, pager, next"
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

			<el-form :model="editForm" :rules="editFormRules" ref="editForm" label-width="100px" class="demo-editForm">

				<el-form-item label="角色名称" prop="name" label-width="100px">
					<el-input v-model="editForm.name" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="唯一编码" prop="code" label-width="100px">
					<el-input v-model="editForm.code" autocomplete="off"></el-input>
				</el-form-item>

				<el-form-item label="描述" prop="remark" label-width="100px">
					<el-input v-model="editForm.remark" autocomplete="off"></el-input>
				</el-form-item>


				<el-form-item label="状态" prop="statu" label-width="100px">
					<el-radio-group v-model="editForm.statu">
						<el-radio :label=0>禁用</el-radio>
						<el-radio :label=1>正常</el-radio>
					</el-radio-group>
				</el-form-item>

				<el-form-item>
					<el-button type="primary" @click="submitForm('editForm')">立即创建</el-button>
					<el-button @click="resetForm('editForm')">重置</el-button>
				</el-form-item>
			</el-form>

		</el-dialog>

		<el-dialog
				title="分配权限"
				:visible.sync="permDialogVisible"
				width="600px">

			<el-form :model="permForm">

				<el-tree
						:data="permTreeData"
						show-checkbox
						ref="permTree"
						:default-expand-all=true
						node-key="id"
						:check-strictly=true
						:props="defaultProps">
				</el-tree>

			</el-form>

			<span slot="footer" class="dialog-footer">
			    <el-button @click="permDialogVisible = false">取 消</el-button>
			    <el-button type="primary" @click="submitPermFormHandle('permForm')">确 定</el-button>
			</span>

		</el-dialog>

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
				},
				tableData: [],

				editFormRules: {
					name: [
						{required: true, message: '请输入角色名称', trigger: 'blur'}
					],
					code: [
						{required: true, message: '请输入唯一编码', trigger: 'blur'}
					],
					statu: [
						{required: true, message: '请选择状态', trigger: 'blur'}
					]
				},
				multipleSelection: [],
				permDialogVisible: false,
				permForm: {},
				defaultProps: {
					children: 'children',
					label: 'name'
				},
				permTreeData: []
			}
		},
		created() {
			this.getRoleList()
		},
		methods: {
      //全选
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
				console.log("勾选")
				console.log(val)
				this.multipleSelection = val;

				this.delBtlStatu = val.length == 0
			},

			handleSizeChange(val) {
				console.log(`每页 ${val} 条`);
				this.size = val
				this.getRoleList()
			},
			handleCurrentChange(val) {
				console.log(`当前页: ${val}`);
				this.current = val
				this.getRoleList()
			},

			resetForm(formName) {
				this.$refs[formName].resetFields();
				this.dialogVisible = false
				this.editForm = {}
			},
			handleClose() {
				this.resetForm('editForm')
			},

      //获取菜单树请求
      getMenuTree() {
        this.$axios.get("/admin/menu/menuList").then((res) => {
          this.permTreeData = res.data.data;
        });
      },

      setPage(){
        this.searchForm.pageNum = this.pageNum
        this.searchForm.pageSize = this.pageSize
      },

      //获得角色列表
			getRoleList() {
				this.$axios.get("/admin/roleListPage"+"?"+ qs.stringify(this.searchForm)
				).then(res => {
					this.tableData = res.data.data.list
					this.pageSize = res.data.data.pageSize
					this.pageNum = res.data.data.pageNum
					this.total = res.data.data.total
				})
			},

			submitForm(formName) {
				this.$refs[formName].validate((valid) => {
					if (valid) {
						this.$axios.post('/sys/role/' + (this.editForm.id?'update' : 'save'), this.editForm)
							.then(res => {

								this.$message({
									showClose: true,
									message: '恭喜你，操作成功',
									type: 'success',
									onClose:() => {
										this.getRoleList()
									}
								});

								this.dialogVisible = false
								this.resetForm(formName)
							})
					} else {
						console.log('error submit!!');
						return false;
					}
				});
			},
			editHandle(id) {
				this.$axios.get('/sys/role/info/' + id).then(res => {
					this.editForm = res.data.data

					this.dialogVisible = true
				})
			},
			delHandle(id) {

				var ids = []

				if (id) {
					ids.push(id)
				} else {
					this.multipleSelection.forEach(row => {
						ids.push(row.id)
					})
				}

			

				this.$axios.post("/sys/role/delete", ids).then(res => {
					this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose:() => {
							this.getRoleList()
						}
					});
				})
			},
      //分配权限
			permHandle(id) {
        this.getMenuTree()
				this.permDialogVisible = true
				this.$axios.get("/admin/role/info/" + id).then(res => {
					this.$refs.permTree.setCheckedKeys(res.data.data.menuIds)
					this.permForm = res.data.data
					
				})
			},

      //分配权限确定
			submitPermFormHandle(formName) {
				var menuIds = this.$refs.permTree.getCheckedKeys()
        console.log(menuIds)
				this.$axios.post('/admin/role/perm/' + this.permForm.id, menuIds).then(res => {
					this.$message({
						showClose: true,
						message: '恭喜你，操作成功',
						type: 'success',
						onClose:() => {
							this.getRoleList()
						}
					});
					this.permDialogVisible = false
					this.resetForm(formName)
				})
			}
		}
	}
</script>

<style scoped>

	.el-pagination {
		
		margin-top: 22px;
	}

</style>