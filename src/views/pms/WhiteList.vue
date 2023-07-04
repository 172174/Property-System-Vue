<template>
  <div >
    <el-card shadow="never" class="header">
      <el-form
        :inline="true"
        size="medium"
        v-model="defaultParams"
        ref="queryForm"
        class="demo-form-inline"
      >

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.numberPlate" placeholder="车牌号"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.ownerName" placeholder="业主姓名"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.type" placeholder="类型">
            <el-option
                v-for="item in typeList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.state" placeholder="状态">
            <el-option
                v-for="item in stateList"
                :key="item.id"
                :label="item.label"
                :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item-button">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button  icon="el-icon-refresh" @click="resetQuery" >重置</el-button>
        </el-form-item>

        <div class="table-button">
        <el-button  @click="handleAdd()" type="info">添加</el-button>
      </div>
      </el-form>

    </el-card>

    <div class="table"  v-loading="loading">
      <el-table :data="whiteList" border class="goods-style" >
      
        <el-table-column label="编号"  align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(defaultParams.pageNum-1)*defaultParams.pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="number" label="车位编号"  align="center">
          <template slot-scope="scope">
            {{scope.row.parkingSpaceNumber}}
          </template>
        </el-table-column>

        <el-table-column prop="ownerName" label="业主姓名"  align="center">
          <template slot-scope="scope">
            {{scope.row.ownerName}}
          </template>
        </el-table-column>

        <el-table-column prop="numberPlate" label="车牌号"  align="center">
          <template slot-scope="scope">
            {{scope.row.numberPlate}}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="类别"

          align="center"
        >
          <template slot-scope="scope">
           {{scope.row.type | Type}}
          </template>
        </el-table-column>

        <el-table-column
          prop="startingTime"
          label="开始时间"
          width="180%"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.startingTime}}
          </template>
        </el-table-column>

        <el-table-column
            prop="endTime"
            label="到期时间"
            width="180%"
            align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.endTime}}
          </template>
        </el-table-column>

        <el-table-column prop="state" label="月租状态" align="center">
          <template slot-scope="scope">
            <el-tag type="success" v-show="scope.row.state==0">正常</el-tag>
            <el-tag type="danger" v-show="scope.row.state==1">已到期</el-tag>
          </template>
        </el-table-column>


        <el-table-column
          prop="operation"
          label="操作"
          align="center"
          width="250%"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleShow(scope.$index, scope.row)"
              >详情</el-button
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

    <el-dialog title="车辆白名单" :visible.sync="open" :before-close="handleClose" >
      <el-form :model="form"  ref="form"  label-width="80px" :disabled="check" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="车位编号" prop="name">
              <el-select v-model="form.number" filterable placeholder="请选择">
                <el-option
                    v-for="item in numberList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="车牌号" prop="name">
              <el-input v-model="form.numberPlate"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="姓名" prop="name">
              <el-input v-model="form.ownerName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="停车类型" prop="name">
              <el-select v-model="form.type"  placeholder="请选择">
                <el-option
                    v-for="item in typeList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>


        </el-row>


        <el-row v-if="form.type == 0">
          <el-col :span="8">
            <el-form-item  prop="avatar" label="入住时间">
              <el-date-picker v-model="form.startingTime" type="datetime" placeholder="选择入住时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item  prop="avatar" label="入住时间">
              <el-date-picker v-model="form.endTime" type="datetime" placeholder="选择入住时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit()">{{ form.id ?'修改':'添加' }}</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

import qs from "qs";

export default {
  name: "whitelist",
  data() {
    return {
      loading:true,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      form:{},
      open: false,
      check:false,
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        ownerName:undefined,
        numberPlate:undefined,
        type:undefined,
        state:undefined,
        parkingSpaceNumber:undefined,
      },
      whiteList:[],
      numberList:[],
      typeList:[{
        id:0,
        label:'月租'
      },{
        id:1,
        label: '购买'
      }],
      stateList:[{
        id:0,
        label:'正常'
      },{
        id:1,
        label: '到期'
      }]
    };
  },
  created(){
    this.getWhiteList()
  },
  computed: {
  },
  methods: {
    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getWhiteList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
        ownerName:undefined,
        numberPlate:undefined,
        type:undefined,
        state:undefined,
        parkingSpaceNumber:undefined,
      }
      this.$refs['queryForm'].resetFields();
      this.getWhiteList();
    },

    //获得列表
    getWhiteList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/pms/whitelist/page"+'?'+params
      ).then(res=>{
        this.whiteList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
        this.loading = false;
      })
    },


    //获取详情
    getDetail(row) {
      this.$axios.get("/admin/pms/whitelist/detail/"+row.id).then(res=>{
        this.form = res.data.data
      })
    },

    //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getWhiteList();
    },

    //查看详情窗口
    handleShow(index, row) {
      this.open = true
      this.check = true
      this.getDetail(row)
    },

    //提交
    submit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$axios.post('/admin/pms/whitelist/' + (this.form.id?'update' : 'save'), this.form)
              .then(res => {
                this.getOwnerList()
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                  onClose:() => {

                  }
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
      alert("点击了删除")
    },

    //修改
    handleEdit(index,row){
      this.open = true
      this.getDetail(row)
    },

    //增添
    handleAdd(){
      this.open = true
    },

    reset() {
      this.form = {

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
    
  },
  filters: {
    State:function (value){
      if (value == 0) return"正常";
      if (value == 1) return "已到期";
    },
    Type: function (value) {
      if (value == 0) return "月租";
      if (value == 1) return "已购买";
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
  width: 100%;
}
</style>