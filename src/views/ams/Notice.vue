<template>
  <div>
    <el-card shadow="never" class="header">
      <el-form
        :inline="true"
        size="medium"
        ref="queryForm"
        v-model="defaultParams"
        class="demo-form-inline"
      >
        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.communityId" placeholder="目标小区">
            <el-option
                v-for="item in communityList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.type" placeholder="类型">
            <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.title" placeholder="标题"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item-button">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button  icon="el-icon-refresh" @click="resetQuery" >重置</el-button>
        </el-form-item>
         <div class="table-button">
           <el-button type="primary" icon="el-icon-chat-dot-square" @click="handleAdd()">发送公告</el-button>
        </div>

      </el-form>

    </el-card>

    <div class="table" style="width: 100%">
      <el-table :data="noticeList" border class="goods-style">
      
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(defaultParams.pageNum-1)*defaultParams.pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="communityName" label="目标小区"  align="center">
          <template slot-scope="scope">
            {{scope.row.communityName}}
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题"  align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{scope.row.title}}
          </template>
        </el-table-column>

        <el-table-column
          prop="content"
          label="内容"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            {{ scope.row.content }}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.type}}
          </template>
        </el-table-column>

        <el-table-column
            prop="state"
            label="是否隐藏"
            align="center"
        >
          <template slot-scope="scope">
            {{scope.row.state}}
          </template>
        </el-table-column>


        <el-table-column prop="checkInTime" label="创建时间" width="180" align="center">
          <template slot-scope="scope" >
            {{scope.row.createTime}}
          </template>
        </el-table-column>

        <el-table-column
            prop="adminName"
            label="发送者"
            align="center"
        >
          <template slot-scope="scope">
            {{scope.row.adminName}}
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

    <el-dialog title="资讯操作" :visible.sync="open" :before-close="handleClose" >
      <el-form :model="form"  ref="form"  label-width="80px"  >
        <el-row>
          <el-col :span="8">
            <el-form-item label="目标小区" prop="communityId">
              <el-select v-model="form.communityId" placeholder="请选择">
                <el-option
                    v-for="item in communityList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="13"></el-col>
        </el-row>


        <el-row>
          <el-col :span="10">
            <el-form-item label="公告类型" prop="type">
              <el-radio v-model="form.type" label="0">系统公告</el-radio>
              <el-radio v-model="form.type" label="1">通知公告</el-radio>
            </el-form-item>
          </el-col>
          <el-col :span="10"></el-col>
        </el-row>

        <el-row>
          <el-col :span="12">
            <el-form-item label="标题" prop="title">
              <el-input v-model="form.title"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10"></el-col>
        </el-row>



        <el-row>
          <el-col :span="22">
            <el-form-item label="内容" prop="content">
              <el-input type="textarea" v-model="form.content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="5">
            <el-form-item  prop="state" label="显示状态">
              <el-switch
                  v-model="form.state"
                  :active-value="stateValue.show"
                  :inactive-value="stateValue.hide"
              >
              </el-switch>
            </el-form-item>
          </el-col>
          <el-col :span="17"></el-col>
        </el-row>



      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit()">{{ edit == true ? "修改" : "发送" }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import qs from "qs";

export default {
  name: "house",
  data() {
    return {
      dialogImageUrl:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      total: 0,
      pageSize: 10,
      pageNum: 1,
      open:false,
      edit:false,
      imgOpen:true,
      selectForm:[],
      form: {},
      communityList:[{
        value: 1,
        label: '1号小区'
      },{
        value: 1,
        label: '2号小区'
      },{
        value: 1,
        label: '3号小区'
      }],
      typeList:[
        {
        value: 0,
        label: '系统公告'
      },{
        value: 1,
        label: '通知公告'
      }],
      stateValue:{
        show:0,
          hide:1
        },
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        type:undefined,
      },
      noticeList:[]
    };
  },
  created(){
    this.getNoticeList()
  },
  computed: {

  },
  methods: {

    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getNoticeList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
        buildingId:undefined,
        houseNum: undefined,
        sale:undefined,
      }
      this.$refs['queryForm'].resetFields();
      this.getNoticeList();
    },

    handleClose(done) {
      done();
      this.cancel()
    },

    //取消
    cancel(){
      this.open = false
      this.edit = false
      this.reset()
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




    //获得住房列表
    getNoticeList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/ams/notice/page"+'?'+params
      ).then(res=>{
        this.noticeList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
      })
    },


    getHouseInfo(id) {
      this.$axios.get("/admin/ams/notice/info/" + id).then((res) => {
        this.form = res.data.data
      });
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getNoticeList();
    },

    //查看详情窗口
    handleShow(index, row) {
      this.$router.push({path:'/hms/details/HouseDetails',query:{id:row.id}});
    },

    //添加
    handleAdd() {
      this.open = true
    },

    //删除
    handleDelete(index,row){
      let that = this
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios.get("/admin/ams/notice/delete/"+row.id
        ).then(res=>{
          if(res.code == 200){
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            that.getNoticeList();
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
      this.getNoticeList();
    },

    //修改
    handleEdit(index,row){
      this.getHouseInfo(row.id)
      this.open = true
      this.edit = true
    },

    //提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$axios.post('/admin/ams/notice/' + (this.form.id ? 'update' : 'save'), this.form)
              .then(res => {
                this.getNoticeList()
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                });
                this.open = false
                this.form ={}
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    }
    
  },
};
</script>

<style scoped>

/* .header {
  width: 320px;
  height: 40px;
  
} */
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
  border: 1px dashed #d9d9d9;
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
  width: 178px;
  height: 178px;
  display: block;
}
</style>