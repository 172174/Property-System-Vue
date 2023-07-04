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
          <el-select v-model="defaultParams.buildingId" placeholder="楼栋号">
            <el-option
                v-for="item in buildingList"
                :key="item.value"
                :label="item.label"
                :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-input v-model="defaultParams.houseNum" placeholder="房间号"></el-input>
        </el-form-item>

        <el-form-item class="demo-form-inline-item">
          <el-select v-model="defaultParams.sale" placeholder="销售状态">
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
         <div class="table-button">
           <el-button type="primary" @click="handleAdd()">添加</el-button>
        </div>

      </el-form>

    </el-card>

    <div class="table" style="width: 100%">
      <el-table :data="houseList" border class="goods-style">
      
        <el-table-column label="编号" width="80" align="center">
          <template slot-scope="scope">
            {{ (scope.$index+1)+(defaultParams.pageNum-1)*defaultParams.pageSize }}
          </template>
        </el-table-column>

        <el-table-column prop="houseNum" label="房间号"  align="center">
          <template slot-scope="scope">
            {{scope.row.buildingName+'-'+scope.row.unit+'-'+scope.row.houseNum}}
          </template>
        </el-table-column>

        <el-table-column
          prop="floor"
          label="楼层"
          align="center"
        >
          <template slot-scope="scope">
            {{ scope.row.floor }}
          </template>
        </el-table-column>

        <el-table-column
          prop="type"
          label="类型"
          align="center"
        >
          <template slot-scope="scope">
            {{scope.row.type}}
          </template>
        </el-table-column>

        <el-table-column prop="unitType" label="户型"  align="center">
          <template slot-scope="scope">
            {{ scope.row.unitType }}
          </template>
        </el-table-column>

        <el-table-column
          prop="area"
          label="面积(m²)"
          align="center"
        >
          <template slot-scope="scope">
           {{scope.row.area}}
          </template>
        </el-table-column>

        <el-table-column prop="sale" label="销售状态"  align="center">
          <template slot-scope="scope">
            <el-tag v-show="scope.row.sale==0">未出售</el-tag>
            <el-tag type="success" v-show="scope.row.sale==1">已出售</el-tag>
          </template>
        </el-table-column>

        <el-table-column prop="checkInTime" label="入住时间" width="180" align="center">
          <template slot-scope="scope" >
            {{scope.row.checkInTime?scope.row.checkInTime:"暂未入住"}}
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
      :current-page="defaultParams.pageNum"
      :page-size="defaultParams.pageSize"
      :hide-on-single-page="true"
      background
      layout="total,prev, pager, next"
      :total="total">
    </el-pagination>
    </div>

    <el-dialog title="住宅操作" :visible.sync="open" :before-close="handleClose" >
      <el-form :model="form" :rules="rules" ref="form"  label-width="80px"  >
        <el-row>
        <el-col :span="8">
          <el-form-item label="楼栋" prop="name">
            <el-select v-model="form.buildingId" placeholder="请选择">
              <el-option
                  v-for="item in buildingList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
        </el-col>
          <el-col :span="5">&nbsp</el-col>
          <el-col :span="8">
            <el-form-item label="单元" prop="name">
              <el-select v-model="form.unit" placeholder="请选择">
                <el-option
                    v-for="item in unitList"
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
              <upload v-model="form.picture"></upload>
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
import upload from "@/components/Upload/multiUpload.vue"

export default {
  name: "house",
  components:{
    upload
  },
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
        label:"未销售"
      },
        {
          value:1,
          label: '已销售'

      }],
      defaultParams: {
        pageSize: 10,
        pageNum: 1,
        buildingId:undefined,
        houseNum: undefined,
        sale:undefined,
      },
      houseList:[]
    };
  },
  created(){
    this.getHouseList()
  },
  computed: {

  },
  methods: {

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
    getHouseList(){
      let params = qs.stringify(this.defaultParams)
      this.$axios.get("/admin/hms/house/page"+'?'+params
      ).then(res=>{
        this.houseList = res.data.data.list
        this.defaultParams.pageSize = res.data.data.pageSize;
        this.defaultParams.pageNum = res.data.data.pageNum;
        this.total = res.data.data.total;
      })
    },


    getHouseInfo(id) {
      this.$axios.get("/admin/hms/house/info/" + id).then((res) => {
        this.form = res.data.data
      });
    },

      //分页页码改变
    handleCurrentChange(val) {
      this.defaultParams.pageNum = val;
      this.getHouseList();
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
      let that = this
      this.$confirm('此操作将删除该数据, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        that.$axios.get("/admin/hms/house/delete/"+row.id
        ).then(res=>{
          if(res.code == 200){
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
            this.getHouseList();
          }else {
            that.$message({
              type: 'success',
              message: '删除成功!'
            });
          }
        })
        that.getHouseList();
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '操作取消'
        });
      });
    },

    //修改
    handleEdit(index,row){
      this.getHouseInfo(row.id)
      this.open = true
    },

    //提交
    submit(){
      this.$refs['form'].validate((valid) => {
        if (valid) {
          this.$axios.post('/admin/hms/house/' + (this.form.id?'update' : 'save'), this.form)
              .then(res => {
                this.getHouseList()
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