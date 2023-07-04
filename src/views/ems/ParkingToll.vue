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
          <el-input v-model="defaultParams.numberPlate" placeholder="车牌号"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.name" placeholder="收费名称"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.type" placeholder="费用类型">
            <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.state" placeholder="缴费情况">
            <el-option
                v-for="item in stateList"
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
      </el-form>

    </el-card>

    <div class="table" style="width: 100%" v-loading="loading">
      <el-table :data="orderList" border class="goods-style">
      <el-table-column label="编号" width="80px" align="center">
        <template slot-scope="scope">
          {{ (scope.$index+1)+(defaultParams.pageNum-1)*defaultParams.pageSize }}
        </template>
      </el-table-column>

      <el-table-column prop="id" label="订单编号" width="100px" align="center">
        <template slot-scope="scope">
          {{scope.row.id}}
        </template>
      </el-table-column>

      <el-table-column prop="numberPlate" label="车牌号码" width="100px" align="center">
        <template slot-scope="scope">
          {{scope.row.numberPlate}}
        </template>
      </el-table-column>

      <el-table-column
          prop="typeName"
          label="费用类别"
          width="80px"
          align="center"
      >
        <template slot-scope="scope">
          {{scope.row.type | Type}}
        </template>
      </el-table-column>

      <el-table-column
          prop="unitPrice"
          label="单价(元)"
          width="80px"
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
          {{ scope.row.quantity}}
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

      <el-table-column prop="state" label="缴费情况"  align="center">
        <template slot-scope="scope">
          <el-tag type="danger" v-show="scope.row.state==0">未缴费</el-tag>
          <el-tag type="success" v-show="scope.row.state==1">缴费完成</el-tag>
        </template>
      </el-table-column>



        <el-table-column
            prop="creationTime"
            label="创建时间"
            width="160px"
            align="center"
        >
          <template slot-scope="scope">
            {{scope.row.creationTime}}
          </template>
        </el-table-column>

        <el-table-column
            prop="endTime"
            label="结束时间"
            width="160px"
            align="center"
        >
          <template slot-scope="scope">
            {{scope.row.endTime}}
          </template>
        </el-table-column>

        <el-table-column
            prop="paymentTime"
            label="支付时间"
            width="160px"
            align="center"
        >
          <template slot-scope="scope">
            {{scope.row.paymentTime}}
          </template>
        </el-table-column>

        <el-table-column prop="payMethod" label="支付方式"  align="center">
          <template slot-scope="scope">
            {{scope.row.payMethod}}
          </template>
        </el-table-column>



        <el-table-column
          prop="operation"
          fixed="right"
          label="操作"
          width="160%"
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


  </div>
</template>

<script>

import qs from "qs";

export default {
  name: "parkingToll",
  data() {
    return {
      loading:true,
      total: 0,
      open: false,
      defaultParams: {
        pageSize:10,
        pageNum:1,
        id:undefined,
        numberPlate:undefined,
        name:undefined,
        type:undefined,
        state:undefined,
      },
      orderList:[],
      stateList:[ {
        value: 0,
        label: '待缴费'
      },{
        value: 1,
        label: '缴费完成'
      },{
        value: 2,
        label: '已取消'
      }],
      typeList:[{
        value:0,
        label:'临停'
      },{
        value: 1,
        label: '月租'
      }],
    };
  },
  created(){
    this.getFeesList()
  },
  computed: {

  },
  methods: {

    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getFeesList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
        id:undefined,
        numberPlate:undefined,
        name:undefined,
        type:undefined,
        state:undefined,
      }
      this.$refs['queryForm'].resetFields();
      this.getFeesList();
    },

    //获得订单列表
    getFeesList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/pms/parkingFee/page"+'?'+params
      ).then(res=>{
        this.orderList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
        this.loading = false;
      })
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getFeesList();
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
    }
    
  },
  filters: {
    Type: function (value) {
      if (value == 0) return "临停";
      if (value == 1) return "月租";
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