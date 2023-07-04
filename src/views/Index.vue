<template>
  <div class="dashboard-editor-container">



    <el-row style="margin:10px;border-radius: 2px;height:200px;">
      <dataList ref="dataList"/>
    </el-row>

    <el-row  style="height:500px">
      <el-col :span="12" style="height:500px;">
        <pieChart ref="pieChart"/>
      </el-col>
      <el-col :span="12" style="height:450px;">
        <barChart ref="barChart"/>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import echarts from 'echarts'
import LineChart from '../components/index/LineChart.vue'
import CountTo from 'vue-count-to'
import dataList from '../components/index/dataList'
import barChart from '../components/index/barChart'
import pieChart from '../components/index/pieChart'
export default {
  name: 'DashboardAdmin',
  components: {
    LineChart,
    CountTo,
    dataList,
    barChart,
    pieChart
  },
  data() {
    return {
      value1: '',
      charts: '',
    }
  },
  created() {
  },
  methods: {
  }
}
</script>

<style lang="scss" scoped>
.componey {
  font-size: 14px;
  text-align: center;
  color: #999;
  padding-bottom: 10px;
}

.dashboard-editor-container {
  background-color: #ebeef5;
  position: relative;
  width: 100%;
  overflow: hidden;

  .github-corner {
    position: absolute;
    top: 0px;
    border: 0;
    right: 0;
  }

  .chart-wrapper {
    background: #fff;
    padding: 16px 16px 0;
    margin-bottom: 20px;
  }
}
.dateSelect {
  position: absolute;
  right: 67px;
  top: 38px;
  z-index: 100;
  .el-date-editor {
    width: 160px;
  }
}
@media (max-width: 1024px) {
  .chart-wrapper {
    padding: 8px;
  }
}
</style>