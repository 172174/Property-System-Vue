<template>
  <div >
    <el-card shadow="never" class="header">
      <el-form
        :inline="true"
        size="medium"
        v-model="selectForm"
        class="demo-form-inline"
      >
        <el-form-item class="demo-form-inline-item">
          <el-select v-model="selectForm.value" placeholder="请选择">
            <el-option
                v-for="item in buildingList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="selectForm.name" placeholder="房间号"></el-input>
        </el-form-item>

        
        <el-form-item class="demo-form-inline-item-button">
          <el-button type="primary" @click="getFeesSettingsList">查询</el-button>
        </el-form-item>

        <div class="table-button">
          <el-button type="primary" @click="addGoods">添加</el-button>
        </div>
      </el-form>

    </el-card>

    <div class="table" style="width: 100%" v-loading="loading">
      <el-table :data="settingList" border class="goods-style">
      
        <el-table-column label="编号" width="95px" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(pageNum-1)*pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="name" label="收费类型" width="130px%" align="center">
          <template slot-scope="scope">
            {{scope.row.name}}
          </template>
        </el-table-column>

        <el-table-column
          prop="unitPrice"
          label="单价(元)"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.unitPrice}}
          </template>
        </el-table-column>

        <el-table-column
            prop="unit"
            label="单位"
            width="180px"
            align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.unit}}
          </template>
        </el-table-column>

        <el-table-column
            prop="cycle"
            label="收费周期(月)"
            width="200px"
            align="center"
        >
          <template slot-scope="scope">
            {{scope.row.cycle }}
          </template>
        </el-table-column>

        <el-table-column
          prop="cycle"
          label="收费日期"
          width="200px"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.billingDate | BillingDate}}
          </template>
        </el-table-column>


        <el-table-column
          prop="operation"
          label="操作"
          width="300%"
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
      :current-page="pageNum"
      :page-size="pageSize"
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
  name: "feeSetting",
  data() {
    return {
      loading:true,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      dialogTableVisible: false,
      dialogFormVisible: false,
      selectForm:[],
      buildingList:[
        {
          value: '选项0',
          label: '所有'
        },{
        value: '选项1',
        label: 'A栋'
      },{
        value: '选项2',
        label: 'B栋'
      },{
        value: '选项3',
        label: 'C栋'
      },{
        value: '选项4',
        label: 'D栋'
      },{
        value: '选项5',
        label: 'E栋'
      }],
      defaultParams: {
        label: "name",
        value: "id",
        children: "childrenCategoryList",
      },
      settingList:[]
    };
  },
  created(){
    this.getFeesSettingsList()
  },
  computed: {

  },
  methods: {
    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getFeesSettingsList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
      }
      this.$refs['queryForm'].resetFields();
      this.getFeesSettingsList();
    },

    //获得车位列表
    getFeesSettingsList(){
      this.selectForm.pageNum = this.pageNum
      this.selectForm.pageSize = this.pageSize
      let params = qs.stringify(this.selectForm)
      this.$axios.get("/admin/fees/settingPage"+'?'+params
      ).then(res=>{
        this.settingList = res.data.data.list
        this.pageSize = res.data.data.pageSize;
        this.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
        this.loading = false;
      })
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.pageNum = val;
      this.getParkingSpaceList();
    },

    //查看详情窗口
    handleShow(index, row) {
      this.$router.push({path:'/hms/details/HouseDetails',query:{id:row.id}});
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
    BillingDate: function (value) {
      if (value == 0) return "每月1号";
      if (value == 1) return "每年1月1号";
    },
    Cycle: function (value) {
      if (value == 1) return "按月";
      if (value == 12) return "按年";
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