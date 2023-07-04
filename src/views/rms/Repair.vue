<template>
  <div >
    <el-card shadow="never" class="header">
      <el-form
        :inline="true"
        size="medium"
        ref="queryForm"
        v-model="defaultParams"
        class="demo-form-inline"
      >
        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.id" placeholder="报修编号"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.ownerName" placeholder="报修人"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.houseNum" placeholder="报修房间号"></el-input>
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

        <el-form-item class="demo-form-inline-item-button">
          <el-button type="primary" icon="el-icon-search" @click="handleQuery">查询</el-button>
          <el-button  icon="el-icon-refresh" @click="resetQuery" >重置</el-button>
        </el-form-item>
        <div class="table-button">
          <el-button type="primary" @click="handleAdd">添加</el-button>
        </div>
      </el-form>

    </el-card>

    <div class="table" style="width: 100%" v-loading="loading">
      <el-table :data="repairList" border >
      
        <el-table-column label="编号" width="80px" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(defaultParams.pageNum-1)*defaultParams.pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="houseNum" label="房屋编号"  align="center">
          <template slot-scope="scope">
            {{scope.row.houseNum}}
          </template>
        </el-table-column>

        <el-table-column prop="ownerName" label="业主姓名"  align="center">
          <template slot-scope="scope">
            {{scope.row.ownerName}}
          </template>
        </el-table-column>

        <el-table-column prop="phoneNumber" label="联系方式" width="120px" align="center">
          <template slot-scope="scope">
            {{ scope.row.phoneNum}}
          </template>
        </el-table-column>

        <el-table-column prop="type" label="报修类别"  align="center">
          <template slot-scope="scope">
            <el-tag type="danger">{{scope.row.type | Type}}</el-tag>

          </template>
        </el-table-column>



        <el-table-column prop="content" label="内容" width="160px" align="center" show-overflow-tooltip>
          <template slot-scope="scope">
            {{ scope.row.content}}
          </template>
        </el-table-column>


        <el-table-column
          prop="createTime"
          label="创建时间"
          width="180px"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.createTime}}
          </template>
        </el-table-column>

        <el-table-column prop="state" label="报修状态"  align="center">
          <template slot-scope="scope">
            <el-tag>{{scope.row.state | State}}</el-tag>

          </template>
        </el-table-column>



        <el-table-column prop="maintenanceStaff" label="维修人员" align="center">
          <template slot-scope="scope">
            {{scope.row.maintenanceStaff}}
          </template>
        </el-table-column>


        <el-table-column
          prop="operation"
          label="操作"
          width="265%"
          align="center"
        >
          <template slot-scope="scope">
            <el-button
                v-if="scope.row.state == 0"
              size="mini"
              @click="handleShow(scope.$index, scope.row)"
              >指派</el-button
            >

            <el-button
                v-else-if="scope.row.state == 1"
                size="mini"
                @click="handleFinish(scope.$index, scope.row)"
            >完成</el-button>

            <el-button
                v-else
                size="mini"
                @click="handleShow(scope.$index, scope.row)"
            >查看</el-button>

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
      background
      layout="total,prev, pager, next"
      :total="total">
    </el-pagination>
    </div>

    <el-dialog title="报修" :visible.sync="open" :before-close="handleClose" >
      <el-form :model="form"  ref="form"  label-width="80px"  >
        <el-row>
          <el-col :span="8">
            <el-form-item label="业主姓名" prop="name" >
              <el-input v-model="form.ownerName" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="联系方式" prop="name">
              <el-input v-model="form.phoneNum" disabled></el-input>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="8">
            <el-form-item label="房间号" prop="name">
              <el-input v-model.number="form.houseNum" disabled></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="维修类型" prop="name">
              <el-select v-model="form.type" placeholder="状态" disabled>
                <el-option
                    v-for="item in repairsTypeList"
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
            <el-form-item label="维修状态" prop="name">
              <el-select v-model="form.state" placeholder="状态" disabled>
                <el-option
                    v-for="item in stateList"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="创建时间" prop="name">
              <el-date-picker disabled v-model="form.createTime" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>


        <el-row>
          <el-col :span="8">
            <el-form-item label="维修人员" prop="name">
              <el-input v-model="form.maintenanceStaff"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item  prop="avatar" label="维修时间">
              <el-date-picker v-model="form.updateTime" type="datetime" placeholder="选择时间" value-format="yyyy-MM-dd HH:mm:ss"></el-date-picker>
            </el-form-item>
          </el-col>
        </el-row>

        <el-row>
          <el-col :span="20">
            <el-form-item  prop="avatar" label="图片">
              <el-image
                  style="width: 100px; height: 100px"
                  :src="form.picture"
                  :preview-src-list="form.picture">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="22">
            <el-form-item label="内容">
              <el-input type="textarea" disabled v-model="form.content"></el-input>
            </el-form-item>
          </el-col>
        </el-row>

      </el-form>

      <span slot="footer" class="dialog-footer">
        <el-button @click="cancel()">取 消</el-button>
        <el-button type="primary" @click="submit">确 定</el-button>
      </span>
    </el-dialog>



  </div>
</template>

<script>

import qs from "qs";

export default {
  name: "repair",
  data() {
    return {
      open:false,
      check:false,
      loading:true,
      total: 0,
      url: 'https://xinyiran.oss-cn-chengdu.aliyuncs.com/xinyiran/2023-03-18/de340303-155a-4172-8cd7-65e726c3deb5.png',
      urlList:["https://xinyiran.oss-cn-chengdu.aliyuncs.com/xinyiran/2023-03-18/c7c1a6f1-5d84-4d34-b699-28510adfaa5e.png"],
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        houseNum:undefined,
        id:undefined,
        ownerName:undefined,
        state:undefined,
      },
      form:{},
      repairList:[],
      repairsTypeList:[{
        value:0,
        label:"管道报修",
      },{
        value:1,
        label:"线路报修",
      },{
        value:2,
        label:"墙体报修",
      },{
        value:3,
        label:"其他",
      }],
      stateList:[{
        value:0,
        label:'未指派'
      },{
        value: 1,
        label: '已指派'
      },{
        value: 2,
        label: '已完成'
      }]
    };
  },
  created(){
    this.getRepairList();
  },
  computed: {
    quantity(q){
      return '数量（'+q+'）'
    }
  },
  methods: {
    tableRowClassName({row, rowIndex}) {
      if (row.state === 0) {
        console.log("ddad")
        return 'warning-row';
      }
      return '';
    },

    /** 查询按钮操作 */
    handleQuery(){
      this.defaultParams.pageNum = 1;
      this.getHouseList();
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
      this.getHouseList();
    },

    //获得费用列表
    getRepairList(){
      let params = qs.stringify(this.defaultParams);
      this.$axios.get("/admin/rms/repair/page"+'?'+params
      ).then(res=>{
        this.repairList = res.data.data.list;
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
        this.loading = false;
      })
    },

    //获取详情
    getDetail(row){
      this.$axios.get("/admin/rms/repair/detail/"+row.id).then(res=>{
        this.form = res.data.data
      })
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getRepairList();
    },

    //查看详情窗口
    handleShow(index, row) {
      this.open = true
      this.check = true
      this.getDetail(row)
    },

    handleAdd(){
      this.open = true;
    },

    handleFinish(index, row){
      this.$axios.get('/admin/rms/repair/finish/'+row.id)
          .then(res => {
              this.getRepairList()
              this.$message({
                showClose: true,
                message: res.msg,
                type: 'success',
              });
            this.open = false
          })
    },

    //提交
    submit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$axios.post('/admin/rms/repair/update', this.form)
              .then(res => {
                this.getRepairList()
                this.$message({
                  showClose: true,
                  message: '恭喜你，操作成功',
                  type: 'success',
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
      if (value == 0) return "未指派";
      if (value == 1) return "已指派人员";
      if (value == 2) return "已完成";
    },
    Type:function (value){
      if(value == 0) return "管道报修";
      if(value == 1) return "线路报修";
      if(value == 2) return "墙体报修";
      if(value == 3) return "其他";
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
.el-table .warning-row {
  background: oldlace;
}

.el-table .success-row {
  background: #f0f9eb;
}
</style>