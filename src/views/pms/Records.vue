<template>
  <div >
    <el-card shadow="never" class="header">
      <el-form :inline="true" size="medium" ref="queryForm" :model="defaultParams" class="demo-form-inline">
        <el-form-item   class="item">
          <el-input v-model="defaultParams.numberPlate" placeholder="车牌号"></el-input>
        </el-form-item>
        <el-form-item   class="item">
          <el-date-picker
              value-format="yyyy-MM-dd HH:mm:ss"
              v-model="dateRange"
              type="datetimerange"
              range-separator="至"
              start-placeholder="开始日期"
              end-placeholder="结束日期">
          </el-date-picker>
        </el-form-item>
        <el-form-item class="item">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button  icon="el-icon-refresh" @click="resetQuery" >重置</el-button>
        </el-form-item>
      </el-form>
    </el-card>

    <div class="table" style="width: 100%" v-loading="loading">
      <el-table :data="recordList" border class="goods-style"   >

        <el-table-column label="编号"  align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(defaultParams.pageNum-1)*defaultParams.pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="numberPlate" label="车牌号"  align="center">
          <template slot-scope="scope">
            {{scope.row.numberPlate}}
          </template>
        </el-table-column>

        <el-table-column
            prop="entryTime"
            label="进入时间"
            align="center"
            empty-text
        >
        </el-table-column>

        <el-table-column
            prop="departureTime"
            label="离开时间"
            align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.departureTime | Time}}
          </template>
        </el-table-column>

        <el-table-column
            prop="type"
            label="开闸方式"
            align="center"
        >
          <template slot-scope="scope">
            {{scope.row.type | Type}}
          </template>
        </el-table-column>

        <el-table-column prop="state" label="停留状态"  align="center">
          <template slot-scope="scope" >
            <el-tag  v-show="scope.row.state == 0">{{scope.row.state | State}}</el-tag>
            <el-tag type="danger" v-show="scope.row.state == 1">{{scope.row.state | State}}</el-tag>

          </template>
        </el-table-column>


        <el-table-column
            prop="operation"
            label="操作"
            align="center"
        >
          <template slot-scope="scope">
<!--            <el-button-->
<!--                size="mini"-->
<!--                @click="handleShow(scope.$index, scope.row)"-->
<!--            >详情</el-button-->
<!--            >-->
<!--            <el-button-->
<!--                size="mini"-->
<!--                @click="handleEdit(scope.$index, scope.row)"-->
<!--            >修改</el-button-->
<!--            >-->

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


    <!--    <el-dialog-->
    <!--      title="编辑货品信息"-->
    <!--      :visible.sync="editSkuInfo.dialogVisible"-->
    <!--      width="40%">-->
    <!--      <span>商品货号：</span>-->
    <!--      <span>{{editSkuInfo.productSn}}</span>-->
    <!--      &lt;!&ndash; <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">-->
    <!--        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>-->
    <!--      </el-input> &ndash;&gt;-->
    <!--      <el-table style="width: 100%;margin-top: 20px"-->
    <!--                :data="editSkuInfo.stockList"-->
    <!--                border>-->
    <!--        <el-table-column-->
    <!--          label="销售价格"-->
    <!--          width="120"-->
    <!--          align="center">-->
    <!--          <template slot-scope="scope">-->
    <!--            <el-input v-model.number="scope.row.price" ></el-input>-->
    <!--          </template>-->
    <!--        </el-table-column>-->

    <!--        <el-table-column-->
    <!--          label="促销价格"-->
    <!--          width="120"-->
    <!--          align="center">-->
    <!--          <template slot-scope="scope">-->
    <!--            <el-input  v-model.number="scope.row.promotionPrice" ></el-input>-->
    <!--          </template>-->
    <!--        </el-table-column>-->
    <!--        <el-table-column-->
    <!--          label="商品库存"-->
    <!--          width="120"-->
    <!--          align="center">-->
    <!--          <template slot-scope="scope">-->
    <!--            <el-input disabled="disabled" v-model="scope.row.stock"></el-input>-->
    <!--          </template>-->
    <!--        </el-table-column>-->

    <!--        <el-table-column-->
    <!--          label="库存更改"-->
    <!--        -->
    <!--          align="center">-->
    <!--          <template slot-scope="scope" >-->
    <!--            <el-input-number v-model.number="scope.row.stockNum"  controls-position="right" :min="-100" :max="100"></el-input-number>-->

    <!--          </template>-->
    <!--        </el-table-column>-->

    <!--      </el-table>-->
    <!--      <span slot="footer" class="dialog-footer">-->
    <!--        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>-->
    <!--        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>-->
    <!--      </span>-->
    <!--    </el-dialog>-->

  </div>
</template>

<script>

import qs from "qs";

export default {
  name: "records",
  data() {
    return {
      loading:true,
      total: 0,
      dialogTableVisible: false,
      dialogFormVisible: false,
      dateRange:[],
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        numberPlate: undefined,
        entryTime:undefined,
        departureTime:undefined,
      },
      recordList:[]
    };
  },
  created(){
    this.getRecordList()
  },
  computed: {
  },
  methods: {

    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.entryTime = this.dateRange[0];
      this.defaultParams.departureTime= this.dateRange[1];
      this.defaultParams.pageNum = 1;
      this.getRecordList()
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.dateRange = [];
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
        numberPlate: undefined,
        entryTime:undefined,
        departureTime:undefined,
      }
      this.$refs['queryForm'].resetFields();
      this.getRecordList()
    },

    //获得车辆进出记录列表
    getRecordList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/pms/record/page"+'?'+params
      ).then(res=>{
        this.recordList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
        this.loading = false;
      })
    },

    //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getRecordList();
    },

    //查看详情窗口
    handleShow(index, row) {
      this.$router.push({path:'/hms/details/HouseDetails',query:{id:row.id}});
    },

    //删除
    handleDelete(index,row){
      alert("点击了删除")
    },

    //修改
    handleEdit(index,row){
      // this.$router.push({path:'/pms/updateGoods',query:{id:row.id}});
      alert("修改")
    }

  },
  filters: {
    State:function (value){
      if (value == 0) return"停留中";
      if (value == 1) return "已离开";
    },
    Type: function (value) {
      if (value == 0) return "自动开闸";
      if (value == 1) return "手动开闸";
    },
    Time:function (value){
      if(value == null && value == undefined) return "暂无数据"
      else return value;
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
  /* height: 40px; */
  margin-left: 0;
  float: left;
}
.item{
  float: left;
  margin-left: 10px;
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