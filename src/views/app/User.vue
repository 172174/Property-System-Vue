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
          <el-input v-model="defaultParams.houseNum" placeholder="用户名"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.sale" placeholder="绑定状态">
            <el-option
                v-for="item in saleList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>



        
        <el-form-item class="demo-form-inline-item-button">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button  icon="el-icon-refresh" @click="resetQuery" >重置</el-button>
        </el-form-item>
<!--         <div class="table-button">-->
<!--           <el-button type="primary" @click="handleAdd()">添加</el-button>-->
<!--        </div>-->

      </el-form>

    </el-card>

    <div class="table" style="width: 100%">
      <el-table :data="userList" border class="goods-style">
      
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(defaultParams.pageNum-1)*defaultParams.pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="username" label="用户名"  align="center">
          <template slot-scope="scope">
            {{scope.row.username}}
          </template>
        </el-table-column>

        <el-table-column
          prop="nickName"
          label="昵称"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.nickName }}
          </template>
        </el-table-column>

        <el-table-column
          prop="avatar"
          label="头像"
          align="center"
        >
          <template slot-scope="scope">
            <el-avatar size="large" :src="scope.row.avatar"></el-avatar>
          </template>
        </el-table-column>



        <el-table-column prop="sale" label="状态"  align="center">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.enabledState==0">正常</el-tag>
            <el-tag type="info" v-show="scope.row.enabledState==1">已停用</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="ownerId" label="绑定业主" width="180" align="center">
          <template slot-scope="scope" >
            <el-tag type="success" v-show="scope.row.ownerId != null">{{ scope.row.ownerName }}</el-tag>
            <el-tag type="warning" v-show="scope.row.ownerId== null">未绑定</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="created" label="创建时间" width="160%"  align="center">
          <template slot-scope="scope">
            {{ scope.row.created }}
          </template>
        </el-table-column>

        <el-table-column prop="lastLogin" label="上次登录时间" width="160%"  align="center">
          <template slot-scope="scope">
            {{ scope.row.lastLogin }}
          </template>
        </el-table-column>

        <el-table-column
          prop="operation"
          label="操作"
          width="218px"
          align="center"
        >
          <template slot-scope="scope">
<!--            <el-button-->
<!--                size="mini"-->
<!--                @click="handleEdit(scope.$index, scope.row)"-->
<!--            >修改</el-button-->
<!--            >-->

            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                v-if="scope.row.enabledState == 0"
            >停用</el-button
            >

            <el-button
                size="mini"
                @click="handleEdit(scope.$index, scope.row)"
                v-else
            >停用</el-button
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

    <el-dialog title="用户操作" :visible.sync="open" :before-close="handleClose" >
      <el-form :model="form"  ref="form"  label-width="80px"  >
        <el-row>
        <el-col :span="8">
          <el-form-item label="用户名" prop="name">
            <el-input v-model="form.username"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="昵称" prop="name">
              <el-input v-model="form.nickName"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="楼层" prop="name">
              <el-input v-model.number="form.floor"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="房间号" prop="name">
              <el-input v-model.number="form.houseNum"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="房屋类型" prop="name">
              <el-select v-model="form.type" placeholder="请选择">
                <el-option
                    v-for="item in type"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="户型" prop="name">
              <el-select v-model="form.unitType" placeholder="请选择">
                <el-option
                    v-for="item in unitType"
                    :key="item.value"
                    :label="item.label"
                    :value="item.label">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
        <el-col :span="8">
          <el-form-item label="面积" prop="name">
            <el-input v-model.number="form.area"></el-input>
          </el-form-item>
        </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item  prop="avatar" label="入住时间">
              <el-date-picker v-model="form.checkInTime" type="datetime" placeholder="选择入住时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item  prop="avatar" label="房屋图片">
              <el-upload
                  action="https://jsonplaceholder.typicode.com/posts/"
                  list-type="picture-card" style="width: 30%">
                <i class="el-icon-plus"></i>
              </el-upload>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="备注">
              <el-input type="textarea" v-model="form.remark"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit()">确 定</el-button>
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
      imgOpen:true,
      selectForm:[],
      form: {},
      unitList:[{
        value: 1,
        label: '一单元'
      },{
        value: 2,
        label: '二单元'
      },{
        value: 3,
        label: '三单元'
      }],
      buildingList:[
        {
        value: 1,
        label: 'A栋'
      },{
        value: 2,
        label: 'B栋'
      },{
        value: 3,
        label: 'C栋'
      },{
        value: 4,
        label: 'D栋'
      },{
        value: 5,
        label: 'E栋'
      }],
      type:[{
        label:'住宅',
        value:0,
      },{
        label: '商铺',
        value: 1,
      }],
      unitType:[{
        label:'一室一厅',
        value:0,
      },
      {
        label:'两室一厅',
        value:2,
      },{
          label:'三室一厅',
          value:3,
        }],
      saleList:[{
        value:0,
        label:"未绑定"
      },
        {
          value:1,
          label: '已绑定'

      }],
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        buildingId:undefined,
        houseNum: undefined,
        sale:undefined,
      },
      userList:[]
    };
  },
  created(){
    this.getUserList()
  },
  computed: {

  },
  methods: {

    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getUserList();
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
      this.getUserList();
    },

    handleClose(done) {
      done();
      this.cancel()
    },

    //取消
    cancel(){
      this.open = false
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
    getUserList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/user/page"+'?'+params
      ).then(res=>{
        this.userList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
      })
    },


    getUserInfo(id) {
      this.$axios.get("/admin/hms/house/info/" + id).then((res) => {
        this.form = res.data.data
      });
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getUserList();
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
      alert("点击了删除")
    },

    //修改
    handleEdit(index,row){
      this.getHouseInfo(row.id)
      this.open = true
    },

    //提交
    submit(){

    },
    
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