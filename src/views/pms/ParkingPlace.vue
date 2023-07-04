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
          <el-input v-model="defaultParams.number" placeholder="车位编号"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.type" placeholder="车位类型">
            <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.state" placeholder="车位状态">
            <el-option
                v-for="item in state"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.isUse" placeholder="车位状态">
            <el-option
                v-for="item in isUse"
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
          <el-button type="primary" @click="handleAdd()">添加</el-button>
        </div>
      </el-form>

    </el-card>

    <div class="table" style="width: 100%" v-loading="loading">
      <el-table :data="parkingSpaceList" border class="goods-style">
      
        <el-table-column label="编号" width="117%" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(pageNum-1)*pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="number" label="车位编号" width="150%" align="center">
          <template slot-scope="scope">
            {{scope.row.number}}
          </template>
        </el-table-column>

        <el-table-column
          prop="state"
          label="车位状态"
          width="130%"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.state | State}}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
          width="130%"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.type | Type}}
          </template>
        </el-table-column>


        <el-table-column
          prop="area"
          label="面积(m²)"
          width="130%"
          align="center"
        >
          <template slot-scope="scope">
           {{scope.row.area}}
          </template>
        </el-table-column>

        <el-table-column prop="isUse" label="使用情况" width="130%" align="center">
          <template slot-scope="scope">
            <el-tag type="danger" v-show="scope.row.isUse==0">占用</el-tag>
            <el-tag type="success" v-show="scope.row.isUse==1">空闲</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="created" label="创建时间" width="200%" align="center">
          <template slot-scope="scope" >
            {{scope.row.created}}
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
      :current-page="defaultParams.pageNum"
      :page-size="defaultParams.pageSize"
      :hide-on-single-page="true"
      background
      layout="total,prev, pager, next"
      :total="total">
    </el-pagination>
    </div>

    <el-dialog title="车位" :visible.sync="open" :before-close="handleClose" >
      <el-form :model="form"  ref="form"  label-width="80px" :disabled="check" >
        <el-row>
          <el-col :span="8">
            <el-form-item label="车位编号" prop="name">
                <el-input v-model="form.number"></el-input>
              </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="车位类型" prop="name">
              <el-select v-model="form.type"  placeholder="请选择">
                <el-option
                    v-for="item in typeList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="面积" prop="name">
              <el-input v-model="form.area"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="车位状态" prop="name">
              <el-select v-model="form.state"  placeholder="请选择">
                <el-option
                    v-for="item in state"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>


        </el-row>


        <el-row >
          <el-col :span="8">
            <el-form-item  prop="avatar" label="使用情况" disabled="true">
              <el-input   :placeholder="form.isUse == 0?'已使用':'未使用'" :disabled="true"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item  prop="avatar" label="创建时间" disabled="true">
              <el-date-picker :disabled="true" v-model="form.created" type="datetime" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-form-item  prop="avatar" label="备注" disabled="true">
            <el-input type="textarea" v-model="form.remark"></el-input>
          </el-form-item>
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
  name: "house",
  data() {
    return {
      loading:true,
      total: 0,
      pageSize: 10,
      pageNum: 1,
      open: false,
      check: false,
      selectForm:[],
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        number:undefined,
        type:undefined,
        state:undefined,
        isUse:undefined,
      },
      form:{},
      parkingSpaceList:[],
      typeList:[{
        value:0,
        label:'普通车位',
      },{
        value: 1,
        label: '特殊车位'
      },{
        value: 3,
        label: '内部车位'
      },{
        value: 2,
        label: '氪金车位'
      }],
      state:[{
        value:0,
        label:'闲置',
      },{
        value:1,
        label:'已出售',
      },{
        value:2,
        label:'已出租',
      }],
      isUse:[{
        value:0,
        label:'占用',
      },{
        value:1,
        label:'空闲',
      }]
    };
  },
  created(){
    this.getParkingSpaceList()
  },
  computed: {

  },
  methods: {
    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getParkingSpaceList();
    },

    /** 重置按钮操作 */
    resetQuery() {
      this.defaultParams={
        pageSize: 10,
        pageNum: 1,
        number:undefined,
        type:undefined,
        state:undefined,
        isUse:undefined,
      }
      this.$refs['queryForm'].resetFields();
      this.getParkingSpaceList();
    },

    //获得详情
    getDetail(row){
      this.$axios.get("/admin/pms/parkingSpace/detail/"+row.id).then(res=>{
        this.form = res.data.data
      })
    },

    //获得车位列表
    getParkingSpaceList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/parkingSpace/listPage"+'?'+params
      ).then(res=>{
        this.parkingSpaceList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
        this.loading = false;
      })
    },

    //提交
    submit() {
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$axios.post('/admin/pms/parkingSpace/' + (this.form.id ? 'update' : 'save'), this.form)
              .then(res => {
                this.getOwnerList()
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
                });
                this.cancel()
              })
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getParkingSpaceList();
    },

    handleAdd(){
      this.reset()
      this.open = true
    },

    //查看详情窗口
    handleShow(index, row) {
      this.open = true
      this.check = true
      this.getDetail(row)
    },

    //删除
    handleDelete(index,row){
      alert("点击了删除")
    },

    //修改
    handleEdit(index,row){
      this.reset()
      this.open = true
      this.getDetail(row)
    },
    // 重置
    reset() {
      this.form = {

      };
      this.$refs['form'].resetFields();
    },

    //关闭弹窗
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
    Type: function (value) {
      if (value == 0) return "普通车位";
      if (value == 1) return "特殊车位";
      if (value == 2) return "氪金车位";
      if (value == 3) return "内部车位";
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