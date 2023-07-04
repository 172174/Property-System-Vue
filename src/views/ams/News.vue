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
          <el-select v-model="defaultParams.type" placeholder="资讯类型">
            <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.state" placeholder="状态">
            <el-option
                v-for="item in stateList"
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
           <el-button type="primary" icon="el-icon-folder-add" @click="handleAdd()">添加资讯</el-button>
        </div>

      </el-form>

    </el-card>

    <div class="table" style="width: 100%">
      <el-table :data="newsList" border class="goods-style">
      
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(defaultParams.pageNum-1)*defaultParams.pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="title" label="标题"  align="center" show-overflow-tooltip>

        </el-table-column>

        <el-table-column prop="content" label="内容" align="center" show-overflow-tooltip>
        </el-table-column>

        <el-table-column
            prop="id"
            label="图片"
            align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="资讯类型"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.type | type}}
          </template>
        </el-table-column>

        <el-table-column prop="state" label="状态"  align="center">
          <template slot-scope="scope">
            {{ scope.row.state }}
          </template>
        </el-table-column>

        <el-table-column
          prop="source"
          label="来源"
          align="center"
        >
          <template slot-scope="scope">
           {{scope.row.source}}
          </template>
        </el-table-column>

        <el-table-column
            prop="views"
            label="已读"
            align="center"
        >
          <template slot-scope="scope">
            {{scope.row.views}}
          </template>
        </el-table-column>


        <el-table-column prop="createTime" label="创建时间" width="180" align="center">
          <template slot-scope="scope" >
            {{scope.row.createTime}}
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
      <el-form :model="form" ref="form"  label-width="80px"  >
        <el-row>
        <el-col :span="8">
          <el-form-item label="资讯类型" prop="type">
            <el-select v-model="form.type" placeholder="请选择">
              <el-option
                  v-for="item in typeList"
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
          <el-col :span="12">
            <el-form-item label="来源" prop="source">
              <el-input v-model.number="form.source"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="10">
          </el-col>
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
          <el-col :span="20">
            <el-form-item  prop="picture" label="图片">
              <upload v-model="form.picture"></upload>
<!--              <el-upload-->
<!--                  action="https://jsonplaceholder.typicode.com/posts/"-->
<!--                  list-type="picture-card" style="width: 30%">-->
<!--                <i class="el-icon-plus"></i>-->
<!--              </el-upload>-->
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
        <el-button type="primary" @click="submit()">{{edit == true?"修改":"添加"}}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import qs from "qs";
import upload from "@/components/Upload/multiUpload.vue"

export default {
  name: "house",
  components:{
    upload
  },
  data() {
    return {
      dialogImageUrl:'https://cube.elemecdn.com/6/94/4d3ea53c084bad6931a56d5158a48jpeg.jpeg',
      total: 0,
      pageSize: 10,
      pageNum: 1,
      edit:false,
      open:false,
      imgOpen:true,
      form: {},
      visible:false,
      typeList:[{
        value: 1,
        label: '小区公告'
      },{
        value: 2,
        label: '小区资讯'
      }],
      stateList:[
        {
        value: 0,
        label: '显示'
      },{
        value: 1,
        label: '隐藏'
      }],
      stateValue:{
        show:0,
        hide:1
      },
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        title:undefined,
        state: undefined,
        type:undefined,
      },
      newsList:[]
    };
  },
  filters:{
    type(value){
      if(value == 1)
      return '小区公告'
      if(value == 2)
        return '小区资讯'
    }
  },
  created(){
    this.getNewsList()
  },
  computed: {

  },
  methods: {

    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getNewsList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
        title:undefined,
        state: undefined,
        type:undefined,
      }
      this.$refs['queryForm'].resetFields();
      this.getNewsList();
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
      };
      this.$refs['form'].resetFields();
    },




    //获得住房列表
    getNewsList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/ams/news/page"+'?'+params
      ).then(res=>{
        this.newsList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
      })
    },


    getHouseInfo(id) {
      this.$axios.get("/admin/ams/news/info/" + id).then((res) => {
        this.form = res.data.data
      });
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getNewsList();
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
      this.getHouseInfo(row.id)
      this.open = true
      this.edit = true
    },

    //提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          console.log(this.form)
          this.$axios.post('/admin/ams/news/' + (this.form.id ? 'update' : 'save'), this.form)
              .then(res => {
                this.getNewsList()
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