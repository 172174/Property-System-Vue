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
          <el-input v-model="defaultParams.id" placeholder="订单编号"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.houseNum" placeholder="房屋编号"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.ownerName" placeholder="业主姓名"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.typeName" placeholder="费用类型"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.state" placeholder="缴费情况">
            <el-option
                v-for="item in state"
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

        <div class="table-button">
          <el-button type="primary" @click="handleAdd">生成费用</el-button>
        </div>
      </el-form>

    </el-card>

    <div class="table" style="width: 100%" v-loading="loading">
      <el-table :data="houseTollList" border class="goods-style">
      
        <el-table-column label="编号" width="80px" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(pageNum-1)*pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="number" label="订单编号" width="100px" align="center">
          <template slot-scope="scope">
            {{scope.row.id}}
          </template>
        </el-table-column>

        <el-table-column prop="houseNum" label="房屋编号" width="100px" align="center">
          <template slot-scope="scope">
            {{scope.row.houseNum}}
          </template>
        </el-table-column>

        <el-table-column prop="ownerName" label="业主" width="100px" align="center">
          <template slot-scope="scope">
            {{scope.row.ownerName}}
          </template>
        </el-table-column>

        <el-table-column
          prop="typeName"
          label="费用类别"
          width="80px"
          align="center"
        >
          <template slot-scope="scope">
           {{scope.row.typeName}}
          </template>
        </el-table-column>

        <el-table-column
          prop="unitPrice"
          label="单价(元)"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.unitPrice}}
          </template>
        </el-table-column>

        <el-table-column
            prop="quantity"
            label="数量"
            width="100px"
            align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.quantity+'('+scope.row.unit+')'}}
          </template>
        </el-table-column>

        <el-table-column
            prop="totalPrice"
            label="总价(元)"
            width="100px"
            align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.totalPrice}}
          </template>
        </el-table-column>

        <el-table-column
          prop="creationTime"
          label="收费日期"
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.creationTime}}
          </template>
        </el-table-column>



        <el-table-column prop="state" label="缴费情况" width="100px" align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-show="scope.row.state==0">未缴费</el-tag>
            <el-tag type="success" v-show="scope.row.state==1">缴费完成</el-tag>
          </template>
        </el-table-column>


        <el-table-column
          prop="operation"
          label="操作"
          width="250%"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              v-if="scope.row.state==0"
              @click="handlePay(scope.$index, scope.row)"
              >缴纳</el-button
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

    <el-dialog title="添加业主" :visible.sync="open" :before-close="handleClose" >
      <el-form :model="form" :rules="rules" ref="form"  label-width="80px"  >
        <el-row>
          <el-col :span="8">
            <el-form-item label="楼栋" prop="name">
              <el-select v-model="form.buildingId" placeholder="请选择">

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="单元" prop="name">
              <el-select v-model="form.unit" placeholder="请选择">

              </el-select>
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

              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="户型" prop="name">
              <el-select v-model="form.unitType" placeholder="请选择">

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
  name: "feeSetting",
  data() {
    return {
      open:false,
      check:false,
      loading:true,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      selectForm:[],
      state:[
        {
          value: 0,
          label: '待缴费'
        },{
        value: 1,
        label: '缴费完成'
      },{
          value: 2,
          label: '欠费'
        }],
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        id:undefined,
        ownerName:undefined,
        houseNum:undefined,
        typeName:undefined,
        state:undefined,
      },
      form:{},
      houseTollList:[],
      pay:{
        out_trade_no:'5615484760',
        subject:'test',
        total_amount:'100.00',
        body:'这是一个测试',
      },
    };
  },
  created(){
    this.getHouseTollList()
  },
  computed: {
    quantity(q){
      return '数量（'+q+'）'
    }
  },
  methods: {
    handleAdd(){
      this.open = true;
    },

    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getHouseTollList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
        id:undefined,
        ownerName:undefined,
        houseNum:undefined,
        typeName:undefined,
        state:undefined,
      }
      this.$refs['queryForm'].resetFields();
      this.getHouseTollList();
    },

    //获得费用列表
    getHouseTollList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/expens/listPage"+'?'+params
      ).then(res=>{
        this.houseTollList = res.data.data.list
        this.pageSize = res.data.data.pageSize;
        this.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
        this.loading = false;
      })
    },

    //获取详情
    getDetail(row){
      this.$axios.get("/admin/ems/expens/detail/"+row.id).then(res=>{
        this.form = res.data.data
      })
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getHouseTollList();
    },

    //查看详情窗口
    handleShow(index, row) {
      this.open = true
      this.check = true
      this.getDetail(row)
    },

    //删除
    handlePay(index,row){
      let that = this
      this.$confirm('是否手动缴纳?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios.get("/admin/ems/expens/pay/"+row.id
        ).then(res=>{
          if(res.code == 200){
            that.$message({
              type: 'success',
              message: '缴费成功!'
            });
            that.getHouseTollList();
          }else {
            that.$message({
              type: 'success',
              message: '缴费失败!'
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
      // this.$router.push({path:'/pms/updateGoods',query:{id:row.id}});
      alert("修改")
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
    State: function (value) {
      if (value == 0) return "闲置";
      if (value == 1) return "已出售";
      if (value == 2) return "已出租";
    },
    Cycle: function (value) {
      if (value == 1) return "每月1号";
      if (value == 12) return "每年1月1号";
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
}
</style>