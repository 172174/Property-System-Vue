<template>
  <div>
    <el-card shadow="never">
      <el-form :model="selectForm"  :inline="true" size="medium" class="demo-form-inline">
        <el-form-item class="demo-form-inline-item">
          <el-input placeholder="订单编号" v-model="selectForm.orderSn" clearable></el-input>
        </el-form-item>
        <el-form-item class="demo-form-inline-item">
          <el-select v-model="selectForm.status" placeholder="请选择状态" clearable>
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.lable"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-button type="primary" @click="getOrderList">查询</el-button>
        </el-form-item>
      </el-form>
      <div class="table-button">
        <el-button type="danger" @click="deleteAll">批量删除</el-button>
      </div>
    </el-card>

    <div class="table">
      <el-table
        :data="orderList"
        border
        class="order-style"
        style="width: 100%"
      >
        <el-table-column type="selection" width="60" align="center">
        </el-table-column>
        <el-table-column prop="id" label="编号" width="75" align="center">
          <template slot-scope="scope">
            {{ scope.row.id }}
          </template>
        </el-table-column>

        <el-table-column
          prop="orderSn"
          label="订单编号"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.orderSn }}
          </template>
        </el-table-column>

        <el-table-column
          prop="createTime"
          label="订单时间"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.createTime }}
          </template>
        </el-table-column>

        <el-table-column
          prop="memberUsername"
          label="用户账号"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.memberUsername }}
          </template>
        </el-table-column>

        <el-table-column
          prop="totalAmount"
          label="金额"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            <p>￥{{ scope.row.totalAmount }}</p>
          </template>
        </el-table-column>

        <el-table-column
          prop="payType"
          label="支付方式"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.payType == 1 ? "支付宝" : "微信" }}
          </template>
        </el-table-column>

        <el-table-column
          prop="sourceType"
          label="订单来源"
          width="130"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.sourceType == 1 ? "APP" : "网页" }}
          </template>
        </el-table-column>

        <el-table-column prop="status" label="状态" width="130" align="center">
          <template slot-scope="scope">
            {{ scope.row.status | Status }}
          </template>
        </el-table-column>

        <el-table-column
          prop="operation"
          label="操作"
          width="220"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
              size="mini"
              @click="handleShowProduct(scope.$index, scope.row)"
              >查看订单</el-button
            >
            <!-- <el-button
              
              size="mini"
              @click="handleEditProduct(scope.$index, scope.row)"
              >修改订单</el-button
            > -->
            <el-button
              v-show="scope.row.status == 1"
              size="mini"
              @click="handleDeliver(scope.$index, scope.row)"
              >订单发货</el-button
            >
            <el-button
              v-show="scope.row.status == 2 || scope.row.status == 3"
              size="mini"
              @click="handleEditProduct(scope.$index, scope.row)"
              >订单追踪</el-button
            >
            <el-button
              v-show="scope.row.status == 4"
              size="mini"
              type="danger"
              @click="handleDeleteProduct(scope.$index, scope.row)"
              >删除订单</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog title="发货" :visible.sync="deliverDialogVisible" width="80%">
      <div class="table-container">
        <el-table
          ref="deliverOrderTable"
          style="width: 100%"
          :data="orderAddress"
          border
        >
          <el-table-column label="订单编号" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.orderSn }}</template>
          </el-table-column>
          <el-table-column label="收货人" width="180" align="center">
            <template slot-scope="scope">{{ scope.row.receiverName }}</template>
          </el-table-column>
          <el-table-column label="手机号码" width="160" align="center">
            <template slot-scope="scope">{{
              scope.row.receiverPhone
            }}</template>
          </el-table-column>
          <el-table-column label="收货地址" align="center">
            <template slot-scope="scope">{{ scope.row.address }}</template>
          </el-table-column>
          <el-table-column label="配送方式" width="160" align="center">
            <template slot-scope="scope">
              <el-select
                placeholder="请选择物流公司"
                v-model="scope.row.deliveryCompany"
                size="small"
              >
                <el-option
                  v-for="item in companyOptions"
                  :key="item"
                  :label="item"
                  :value="item"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column label="物流单号" width="180" align="center">
            <template slot-scope="scope">
              <el-input size="small" v-model="scope.row.deliverySn"></el-input>
            </template>
          </el-table-column>
        </el-table>
        <div style="margin-top: 15px; text-align: center">
          <el-button @click="cancel">取消</el-button>
          <el-button @click="confirm" type="primary">确定</el-button>
        </div>
      </div>
    </el-dialog>

    <el-pagination
      @current-change="handleCurrentChange"
      :current-page="current"
      background
      :hide-on-single-page="true"
      layout="total,prev, pager, next"
      :total="total"
    >
    </el-pagination>
  </div>
</template>

<script>
export default {
  name: "commodity",
  data() {
    return {
      total: 0,
      size: 10,
      current: 1,
      num: 0,
      selectForm:{},
      commoditySearch: [],
      deliverDialogVisible: false,
      orderAddress: [],
      orderList: [],

      // 0->待付款；1->待发货；2->已发货；3->已完成；4->已关闭；5->无效订单
      options: [
        {
          lable: "待付款",
          value: 0,
        },
        {
          lable: "待发货",
          value: 1,
        },
        {
          lable: "已发货",
          value: 2,
        },
        {
          lable: "已完成",
          value: 3,
        },
        {
          lable: "已关闭",
          value: 4,
        },
      ],
      companyOptions: ["顺丰快递", "圆通快递", "中通快递", "韵达快递"],
    };
  },
  created() {
    this.getOrderList();
  },
  methods: {
    //分页页码改变
    handleCurrentChange(val) {
      this.current = val;
      this.getOrderList();
    },



    getOrderList(){
      this.selectForm.current = this.current
      this.selectForm.size = this.size
      this.$axios.post('/oms/order/list',this.selectForm).then(res=>{
        this.orderList = res.data.data.records
        this.size = res.data.data.size;
        this.current = res.data.data.current;
        this.total = res.data.data.total;
       
      })
    },
    //获取订单列表
    // getOrderList() {
    //   this.$axios
    //     .get("/oms/order/list", {
    //       params: {
    //         current: this.current,
    //         size: this.size,
    //       },
    //     })
    //     .then((res) => {
    //       this.orderList = res.data.data.records;
    //       this.size = res.data.data.size;
    //       this.current = res.data.data.current;
    //       this.total = res.data.data.total;
    //     });
    // },
    //订单详情
    handleShowProduct(index, row) {
      this.$router.push({ path: "/oms/orderDetail", query: { id: row.id } });
    },
    //显示发货界面
    handleDeliver(index, row) {
      this.deliverDialogVisible = true;
      this.$axios.get("/oms/order/getAddress/" + row.id).then((res) => {
        this.orderAddress.push(res.data.data);
      });
    },
    //发货
    confirm() {
      this.$axios
        .post("/oms/order/delivery", this.orderAddress[0])
        .then((res) => {
          this.getOrderList();
          this.orderAddress = [];
          this.$message({
            type: "success",
            message: res.data.msg,
          });
          this.deliverDialogVisible = false;
        });
    },
    searchCommodity() {},
    deleteAll() {},

    cancel() {
      this.deliverDialogVisible = false;
      this.orderAddress = [];
    },
  },
  filters: {
    Status: function (value) {
      if (value == 0) return "待付款";
      if (value == 1) return "待发货";
      if (value == 2) return "已发货";
      if (value == 3) return "已完成";
      if (value == 4) return "已关闭";
    },
    PayType: function (value) {
      if (value == 0) return "未支付";
      if (value == 1) return "支付宝";
      if (value == 2) return "微信";
    },
    SourceType: function (value) {
      if (value == 0) return "PC订单";
      if (value == 1) return "APP订单";
    },
  },
};
</script>

<style scoped>
.demo-form-inline {
  width: 80%;
  height: 40px;
  margin-left: 0;
  float: left;
}
.demo-form-inline-item {
  margin-right: 20px;
  float: left;
}
.table-button {
  float: right;
}
.el-card {
  height: 80px;
  margin-bottom: 10px;
  width: 100%;
}
.order-style {
  text-align: center;
}
.el-pagination {
  margin-top: 30px;
  margin-bottom: 30px;
}
</style>