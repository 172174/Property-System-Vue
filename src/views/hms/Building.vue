<template>
  <div>
    <el-card shadow="never" class="header">
      <el-form
        :inline="true"
        size="medium"
        :model="selectForm"
        class="demo-form-inline"
      >
        <el-form-item class="demo-form-inline-item">
          <el-input v-model="selectForm.name" placeholder="商品名"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-cascader
            :props="defaultParams"
            v-model="selectProductCateValue"
            @change="getProductCategoryId"
            :options="productCateOptions"
            placeholder="请选择商品类别"
           
          >
          </el-cascader>
    
        </el-form-item>

<!--        <el-form-item class="demo-form-inline-item">-->
<!--          <el-select v-model="selectForm.status"  placeholder="请选择状态" clearable>-->
<!--            <el-option-->
<!--              v-for="item in statusOptions"-->
<!--              :key="item.value"-->
<!--              :label="item.lable"-->
<!--              :value="item.value"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

<!--        <el-form-item class="demo-form-inline-item">-->
<!--          <el-select v-model="selectForm.stock"  placeholder="请选择库存" clearable>-->
<!--            <el-option-->
<!--              v-for="item in stockOptions"-->
<!--              :key="item.value"-->
<!--              :label="item.lable"-->
<!--              :value="item.value"-->
<!--            >-->
<!--            </el-option>-->
<!--          </el-select>-->
<!--        </el-form-item>-->

        
        <el-form-item class="demo-form-inline-item-button">
          <el-button type="primary" @click="getList">查询</el-button>
        </el-form-item>
      </el-form>
      <!-- <div class="table-button">
        <el-button type="primary" @click="addGoods">添加</el-button>
        <el-button type="danger" @click="deleteAll">批量删除</el-button>
      </div> -->
    </el-card>

    <div class="table" style="width: 100%">
      <el-table :data="houseList" border class="goods-style">
      
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(pageNum-1)*pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="houseNum" label="住房编号" width="140" align="center">
          <template slot-scope="scope">
            {{scope.row.houseNum}}
          </template>
        </el-table-column>

        <el-table-column
          prop="floor"
          label="楼层"
          width="150"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.floor }}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.type}}
          </template>
        </el-table-column>

        <el-table-column prop="unitType" label="户型" width="140" align="center">
          <template slot-scope="scope">
            {{ scope.row.unitType }}
          </template>
        </el-table-column>

        <el-table-column
          prop="area"
          label="面积"
          width="140"
          align="center"
        >
          <template slot-scope="scope">
           {{scope.row.area}}
          </template>
        </el-table-column>

        <el-table-column prop="sale" label="销售状态" width="140" align="center">
          <template slot-scope="scope">
            {{ scope.row.sale }}
          </template>
        </el-table-column>

        <el-table-column prop="checkInTime" label="入住时间" width="140" align="center">
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
      :current-page="current"
      background
      layout="total,prev, pager, next"
      :total="total">
    </el-pagination>
    </div>


    <el-dialog
      title="编辑货品信息"
      :visible.sync="editSkuInfo.dialogVisible"
      width="40%">
      <span>商品货号：</span>
      <span>{{editSkuInfo.productSn}}</span>
      <!-- <el-input placeholder="按sku编号搜索" v-model="editSkuInfo.keyword" size="small" style="width: 50%;margin-left: 20px">
        <el-button slot="append" icon="el-icon-search" @click="handleSearchEditSku"></el-button>
      </el-input> -->
      <el-table style="width: 100%;margin-top: 20px"
                :data="editSkuInfo.stockList"
                border>
        <el-table-column
          label="销售价格"
          width="120"
          align="center">
          <template slot-scope="scope">
            <el-input v-model.number="scope.row.price" ></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="促销价格"
          width="120"
          align="center">
          <template slot-scope="scope">
            <el-input  v-model.number="scope.row.promotionPrice" ></el-input>
          </template>
        </el-table-column>
        <el-table-column
          label="商品库存"
          width="120"
          align="center">
          <template slot-scope="scope">
            <el-input disabled="disabled" v-model="scope.row.stock"></el-input>
          </template>
        </el-table-column>

        <el-table-column
          label="库存更改"
        
          align="center">
          <template slot-scope="scope" >
            <el-input-number v-model.number="scope.row.stockNum"  controls-position="right" :min="-100" :max="100"></el-input-number>

          </template>
        </el-table-column>

      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editSkuInfo.dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="handleEditSkuConfirm">确 定</el-button>
      </span>
    </el-dialog>

  </div>
</template>

<script>

export default {
  name: "building",
  data() {
    return {
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dialogTableVisible: false,
      dialogFormVisible: false,
      selectForm:[],
      defaultParams: {
        label: "name",
        value: "id",
        children: "childrenCategoryList",
      },
      houseList:[]
    };
  },
  created(){

  },
  computed: {
  },
  methods: {
    numValid(val){
   //只能输入数字
   this[val] =this[val].replace(/[^0-9]/g,'')
    },

    change(e) {
    let a = e.target.value.replace(/[^\d]/g, "");
    // console.log(a, e.target.value)
    if (a != e.target.value) {
      this.flag = true;
    } else {
      this.flag = false;
    }
  },


    //获得住房列表
    getList(){
      this.selectForm.pageNum = this.pageNum
      this.selectForm.pageSize = this.pageSize
      
      this.$axios.post("/admin/houseList",this.selectForm
      ).then(res=>{
        this.houseList = res.data.data.list
        this.pageSize = res.data.data.pageSize;
        this.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
      })
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.current = val;
      this.getList();
    },

    //查看详情窗口
    handleShow(index, row) {
      // this.$router.push({path:'/pms/goodsDetails',query:{id:row.id}});
      alert("点击了查看")
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