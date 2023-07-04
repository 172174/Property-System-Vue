<template>
    <div class="dataBoard">
      <el-row class="d1">
        <span style="float: left;margin: 5px 0 5px 20px;font-size: 18px;font-weight:800">小区信息</span>
      </el-row>

      <el-row class="d2">
        <el-col :span="8" class="dataBoard-item" v-for="(item, i) in menuList" :key="i">
          <div class="info"  >
            <div class="info-body">
              <!--                      <i class="el-icon-edit"></i>-->
            </div>
            <div class="info-body" >
              <div class="info-count">
                <count-to :start-val="0" :end-val="item.num" :duration="2600" class="card-panel-num" />
              </div>
              <div class="info-count-text">
                {{ item.fullName }}
              </div>
            </div>
          </div>
        </el-col>
      </el-row>
    </div>



</template>
<script>
import CountTo from 'vue-count-to'
export default {
  components: {
    CountTo
  },
  props:{

  },
    data() {
        return {
            menuList: [
                {
              fullName: '总栋数',
              num: 10,
              icon: 'el-icon-message-solid',
            },{
              fullName: '总户数',
              num: 20,
              icon: 'icon-ym icon-ym-wf-payDistribution',
            },{
              fullName: '总停车位',
              num: 100,
              icon: 'icon-ym icon-ym-wf-incomeRecognition',
            }],
        };
    },
    created() {},
    methods: {
        initData(delayFee, needPay) {
            this.menuList.push({
                fullName: '待收费数据（条）',
                num: needPay.count,
                icon: 'el-icon-message-solid',
            });
            this.menuList.push({
                fullName: '待收费金额（元）',
                num: needPay.sum,
                icon: 'icon-ym icon-ym-wf-payDistribution',
            });
            this.menuList.push({
                fullName: '欠费数据（条）',
                num: delayFee.count,
                icon: 'icon-ym icon-ym-wf-incomeRecognition',
            });
            this.menuList.push({
                fullName: '欠费金额（元）',
                num: delayFee.sum,
                icon: 'icon-ym icon-ym-wf-payDistribution',
            });
        },
    },
};
</script>
<style lang="scss" scoped>
.dataBoard {
    height: 100%;
    overflow: hidden;
    .dataBoard-item {
        height: 100%;
    }
  background-color: #ffffff;


  .d1 {
        width: 100%;
        height: 20%;
    }
  .d2{
    width: 100%;
    height: 80%;
  }
  .info{
    width: 100%;
    height: 100%;
    display:flex;
    align-items:center;
    justify-content:center;
  }
  .info-count{
    font-size: 24px;
    font-weight: bold;
  }

  .info-count-text{
    font-size: 10px;
    margin-top: 5px;

  }
  //.info-body{
//  margin: auto;
//}
}
</style>
