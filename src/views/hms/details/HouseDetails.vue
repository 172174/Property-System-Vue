<template>
  <el-card class="box-card" shadow="never">
    <el-tabs v-model="activeName" @tab-click="handleClick">
      <el-tab-pane label="住房信息" name="first">
        <el-col :span="7">
        
          <div class="image">
            <el-image
              style="width: 80%; height: 400px;"
              :src="url"
              :preview-src-list="srcList"
            >
            </el-image>
          </div>
          <span >户型图</span>
        </el-col>
        <el-col :span="1"><el-divider direction="vertical"></el-divider></el-col>
        <el-col :span="15">
          <div class="grid-content">
            <el-descriptions
              class="margin-top"
              title="基本信息"
              direction="vertical"
              :column="4"
              size="medium"
              border
            >
              <el-descriptions-item>
                <template slot="label">
                  楼栋
                </template>
                {{houseInfo.buildingName}}栋
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  单元
                </template>
                {{houseInfo.unit}}单元
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  房间号
                </template>
                {{houseInfo.houseNum}}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  楼层
                </template>
                {{houseInfo.floor}}层
              </el-descriptions-item>

             <el-descriptions-item>
                <template slot="label">
                  类型
                </template>
                {{houseInfo.type}}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  户型
                </template>
                {{houseInfo.unitType}}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  面积(m²)
                </template>
                {{houseInfo.area}}
              </el-descriptions-item>

              <el-descriptions-item>
                <template slot="label">
                  入住情况
                </template>
                {{houseInfo.checkInTime==null?'未入住':'已入住'}}
              </el-descriptions-item>

            </el-descriptions>
          </div></el-col
        >
      </el-tab-pane>
      <!--  -->
      <el-tab-pane label="业主信息"  name="second" :disabled="houseInfo.checkInTime==null">
        <el-card  v-for="owner in ownerList "  style="margin-bottom: 10px">
          <el-row :gutter="2">
            <el-col :span="3">
              <div class="grid-content bg-purple">
                <el-image
                style="width: 100px; height: 100px"
                :src="owner.avatar"
                fit="contain ">
                </el-image>
              </div>
            </el-col>

            <el-col :span="21">
              <div class="grid-content bg-purple">
              <el-descriptions  class="margin-top" :column="3"  border  >
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-user"></i>
                    姓名
                  </template>
                  {{ owner.name }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-mobile-phone"></i>
                    联系电话
                  </template>
                  {{ owner.phoneNum }}
                </el-descriptions-item>
                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-postcard"></i>
                    身份证
                  </template>
                  {{ owner.idCard }}
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-tickets"></i>
                    备注
                  </template>
                  <el-tag size="small" type="danger">{{ owner.homeowner==0?'房屋产权人':'住户' }}</el-tag>
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-timer"></i>
                    入住时间
                  </template>
                  {{ owner.checkInTime }}
                </el-descriptions-item>

                <el-descriptions-item>
                  <template slot="label">
                    <i class="el-icon-location-outline"></i>
                    居住地
                  </template>
                  成都市
                </el-descriptions-item>

                <el-descriptions-item >
                  <template slot="label">
                    <i class="el-icon-office-building"></i>
                    联系地址
                  </template>
                  四川省成都市郫都区百草路1188号
                </el-descriptions-item>
              </el-descriptions>
            </div></el-col>
          </el-row>


        </el-card>

        </el-tab-pane>
      <!--  -->
<!--      <el-tab-pane label="后续扩展" disabled name="third">待开发</el-tab-pane>-->
    </el-tabs>
  </el-card>
</template>
<script>
export default {
  name: "HouseDetails",
  data() {
    return {
      id:null,
      activeName: "first",
      houseInfo:{},
      ownerList:[],
      ownerUrl:'http://pic.22520.cn/up/200211/1581416230895792.jpg'
      ,
      url: "https://img.zcool.cn/community/017dcf5ce8b9caa80121a470485cdf.png@1280w_1l_2o_100sh.png",
      srcList: [
        "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg",
        "https://fuss10.elemecdn.com/8/27/f01c15bb73e1ef3793e64e6b7bbccjpeg.jpeg",
        "https://fuss10.elemecdn.com/1/8e/aeffeb4de74e2fde4bd74fc7b4486jpeg.jpeg",
      ],
      pic:null
      ,
      picList:[]
    };
  },
  created(){
      this.id = this.$route.query.id
      this.getHouseInfo()
  },
  computed:{
  }
  ,
  methods: {
    handleClick(tab, event) {
    },
    getHouseInfo() {
      this.$axios.get("/admin/hms/house/info/" + this.$route.query.id).then((res) => {
        this.houseInfo = res.data.data
        this.ownerList = res.data.data.owners
      });
    },
  },
};
</script>

<style scoped>
.box-card {
  width: 100%;
}
.image {
  border: 1px;
}
.grid-content {
  display: flex;
  flex-direction: column;
}
.margin-top{
    width: 100%;
}
</style>