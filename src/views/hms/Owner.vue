<template >
  <div >
    <el-card shadow="hover" class="header">
      <el-form
        :inline="true"
        size="medium"
        v-model="defaultParams"
        ref="queryForm"
        class="demo-form-inline"
      >
        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.name" placeholder="姓名"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.phoneNum" placeholder="联系电话"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.houseNum" placeholder="房间号"></el-input>
        </el-form-item>


        <el-form-item class="demo-form-inline-item-button">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button  icon="el-icon-refresh" @click="resetQuery" >重置</el-button>
        </el-form-item>

        <div class="table-button">
          <el-button type="primary" @click="handleAdd()">添加</el-button>
        </div>
      </el-form>

    </el-card>

    <div class="table" style="width: 100%">
      <el-table :data="ownerList" border class="goods-style">
      
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(pageNum-1)*pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="姓名"  align="center">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>

        <el-table-column
          prop="gender"
          label="性别"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.gender }}
          </template>
        </el-table-column>

        <el-table-column
          prop="idCard"
          label="身份证号码"
          width="175"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.idCard}}
          </template>
        </el-table-column>

        <el-table-column prop="phoneNum" label="联系电话"  align="center">
          <template slot-scope="scope">
            {{ scope.row.phoneNum }}
          </template>
        </el-table-column>

        <el-table-column
          prop="houseNum"
          label="房间号"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
           {{scope.row.houseNum}}
          </template>
        </el-table-column>

        <el-table-column prop="homeowner" label="状态"  align="center">
          <template slot-scope="scope">
            {{ scope.row.homeowner | HomeOwner}}
          </template>
        </el-table-column>

        <el-table-column prop="checkInTime" label="入住时间" width="175" align="center">
          <template slot-scope="scope">
           {{scope.row.checkInTime}}
          </template>
        </el-table-column>

        <el-table-column
          prop="operation"
          label="操作"
          width="218px"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleShow(scope.$index, scope.row)"
              >查看</el-button
            >
            <el-button
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
              >修改</el-button
            >

            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >删除</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <div class="pagination">
    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="defaultParams.pageNum"
      :page-size="defaultParams.pageSize"
      :hide-on-single-page="true"
      background
      layout="total,prev, pager, next"
      :total="total">
    </el-pagination>
    </div>



    <el-dialog title="添加业主" :visible.sync="open" :before-close="handleClose">
      <el-form :model="form" :rules="rules" ref="form"  label-width="80px"  :disabled="check">

        <el-row>
          <el-col :span="12">
            <el-row>
              <el-form-item label="姓名" prop="name">
                <el-input v-model="form.name"></el-input>
              </el-form-item>
            </el-row>
            <el-row>
              <el-form-item label="身份证" prop="idCard">
                <el-input v-model="form.idCard" maxlength="18"></el-input>
              </el-form-item>
            </el-row>

            <el-row>

                <el-form-item label="联系电话" prop="phoneNum">
                  <el-input v-model.number="form.phoneNum" maxlength="11"></el-input>
                </el-form-item>
            </el-row>
          </el-col>


          <el-col :span="12">
            <el-form-item  prop="avatar" >
              <el-image v-show="form.avatar!= null"
                  style="width: 60%; height: 60%"
                  :src="form.avatar"
                  fit="contain ">
              </el-image>
              <upload v-show="form.avatar== null"  v-model="form.avatar"></upload>
            </el-form-item>
          </el-col>

        </el-row>


        <el-row>
          <el-col :span="12">
            <el-form-item label="性别" prop="gender" >
              <el-select v-model="form.gender" placeholder="请选择">
                <el-option
                    v-for="item in genderType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">


            <el-form-item label="住房" prop="houseNumber" >
              <el-cascader v-model="form.houseNumber" :options="houseTree" :props="{ expandTrigger: 'hover',value:'id',label:'name' }" >
                <template slot-scope="{ node, data }">
                  <span v-if="data.type == 0"> {{ data.name }}栋 </span>
                  <span v-else-if="data.type == 1"> {{ data.name }}单元</span>
                  <span v-else> {{ data.name }}号</span>
                </template>
              </el-cascader>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="入住时间" prop="checkInTime">
              <el-date-picker v-model="form.checkInTime" type="datetime" placeholder="选择入住时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="离开时间" prop="movingOutTime">
              <el-date-picker v-model="form.movingOutTime" type="datetime" placeholder="选择离开时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
          <el-form-item label="产权人" prop="homeowner">
            <el-switch :active-value="active" :inactive-value="inactive" v-model="form.homeowner"></el-switch>
          </el-form-item>
          </el-col>
          <el-col :span="12">
          </el-col>
        </el-row>
      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit()" v-show="check == false">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>
import qs from "qs"
import upload from "@/components/Upload/multiUpload.vue"
export default {
  name: "Owner",
  components:{
    upload
  },
  data() {
    return {
      check:false,
      avatar:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
      open:false,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dialogTableVisible: false,
      dialogFormVisible: false,
      active:0,
      inactive:1,
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        houseNum:undefined,
        name: undefined,
        phoneNum:undefined,
      },
      ownerList:[],
      houseIds:[],
      form:{},
      genderType:[
          {
            value:'男',
            label:'男'
          },
          {
            value: '女',
            label: '女'
          },
          {
            value: '未知',
            label: '未知'
          }],
      rules: {
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' },
          { min: 1, max: 10, message: '长度在 1 到 10 个字符', trigger: 'blur' }
        ],
        gender: [
          { required: true, message: '请选择性别', trigger: 'change' }
        ],
        idCard: [
          { required: true, message: '请输入身份证号码', trigger: 'blur' },
          { pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}$)/, message: '请输入正确的身份证号码', trigger: 'blur' }
        ],
        phoneNum: [
          { required: true, message: '请输入电话号码', trigger: 'blur' },
          { pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的联系电话号码', trigger: 'blur' }
        ],
        houseNumber: [
          { required: true, message: '请绑定住房', trigger: 'change' }
        ],
        checkInTime: [
          {  required: true, message: '请选择日期', trigger: 'change' }
        ],
        movingOutTime: [
          {  required: false, message: '请选择时间', trigger: 'change' }
        ],
      },
      houseTree:[],
      houseNumber:[],
    };
  },
  created(){
    this.getOwnerList();
    this.getHouseTree()
  },
  computed: {
  },
  methods: {
    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getOwnerList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
        name:undefined,
        houseNum: undefined,
        phoneNum:undefined,
      }
      this.$refs['queryForm'].resetFields();
      this.getOwnerList();
    },

    reset() {
      this.form = {
        name: undefined,
        gender: undefined,
        idCard: undefined,
        phoneNum: undefined,
        houseNum: undefined,
        movingOutTime: undefined,
        checkInTime: undefined,
        homeowner: 1,
      };
      this.$refs['form'].resetFields();
    },

    handleClose(done) {
      done();
      this.cancel()
    },

    //取消
    cancel(){
      this.open = false
      this.check = false
      this.reset()
    },

    //获得业主列表
    getOwnerList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/hms/owner/page"+"?"+params
      ).then(res=>{
        this.ownerList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
      })
    },
    //获取住宅树
    getHouseTree(){
      this.$axios.get("/admin/building/houseTree").then(res =>{
        this.houseTree = res.data.data
      })

    },

    //获得详情
    getDetail(row){
      this.$axios.get("/admin/hms/owner/details/"+row.id).then(res => {
        this.form = res.data.data
        let unit = Number(this.form.houseNum.split('-')[1])
        this.form.houseNumber = []
        this.form.houseNumber.push(this.form.buildingId,unit,this.form.houseId)
      })
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getOwnerList();
    },

    //查看详情窗口
    handleShow(index, row) {
      this.open = true;
      this.getDetail(row)
      this.check = true
    },



    //添加
    handleAdd() {
      this.open = true
    },



    //提交
    submit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.form.houseId = this.form.houseNumber[2]
          this.$axios.post('/admin/hms/owner/' + (this.form.id?'update' : 'save'), this.form)
              .then(res => {
                this.getOwnerList()
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                });
                this.open = false
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

    //删除
    handleDelete(index,row){
      let that = this
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios.get("/admin/ams/news/delete/"+row.id
        ).then(res=>{
          if(res.code == 200){
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.getNewsList();
          }else {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        });
      });
    },

    //修改
    handleEdit(index,row){
      this.reset()
      this.open = true;
      this.getDetail(row)
    },
  },
  filters: {
    HomeOwner: function (value) {
      if (value == 0) return "业主";
      if (value == 1) return "成员";
    },
  },
};
</script>

<style scoped>

.margin-top {
  font-size: 15px;
  /* line-height: 20; */
}

.pagination{
  margin-top: 30px;
  margin-bottom: 30px;
  font-size: 15px;
}
.el-descriptions-item {
  line-height: 1;
}

.demo-form-inline {
  width: 100%;

  /* height: 40px; */
  margin-left: 0;
  float: left;
}
.demo-form-inline-item {

  margin-right: 20px;
  width: 200px;
  float: left;
}
.demo-form-inline-item-button{
  float: left;
}


.table-button {
  float: right;
}
.el-card {
  /* height: 80px; */
  margin-bottom: 10px;
  width: 100%;
}
.goods-style {
  text-align: center;
}

.avatar-uploader .el-upload {
  border: 2px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
}
.avatar {
  width: 150px;
  height: 200px;
  display: block;
}

</style>