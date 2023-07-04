<template>
  <el-card shadow="never" class="portal-eChart-box">
    <div slot="header" class="portal-common-title">
      <span>{{title}}</span>
    </div>
    <div class="eChart-box-body">
      <div ref="chart" id="chart" v-show="!isEmpty" style="width:100%;height:400px;margin-top:10px;"></div>
    </div>
  </el-card>
</template>
<script>
import echarts from 'echarts'
import resize from './mixins/resize'
export default {
  mixins: [resize],
  data() {
    return {
      chart: null,
      isEmpty: false,
      title: '车位出售情况',
      option: {}
    }
  },
  mounted() {
    this.initChart(100)
  },
  watch: {
  },
  methods: {
    initChart(data) {
      this.chart = echarts.init(this.$refs.chart)
      var option = {
			"title": {
				"text": "",
				"left": "center"
			},
			"tooltip": {
				"trigger": "item",
				"formatter": "{a} <br/>{b} : {c} ({d}%)"
			},
			"legend": {
				"bottom": 10,
				"left": "center",
				"data": ["空置", "出租", "出售"]
			},
			"series": [{
				"type": "pie",
				"radius": "65%",
				"center": ["50%", "50%"],
				"selectedMode": "single",
				"data": [{
					"value": 100,
					"name": "空置",
					"itemStyle": {
						"color": "#1890ff"
					}
				}, {
					"value": 50,
					"name": "出租",
					"itemStyle": {
						"color": "#ff3b3b"
					}
				}, {
					"value": 100,
					"name": "出售",
					"itemStyle": {
						"color": "#7b1ae1"
					}
				}],
				"emphasis": {
					"itemStyle": {
						"shadowBlur": 10,
						"shadowOffsetX": 0,
						"shadowColor": "rgba(0, 0, 0, 0.5)"
					}
				}
			}]
		}
      this.chart.setOption(option)
      setTimeout(() => {
        this.$nextTick(() => {
          this.chart.resize();
        })
      }, 50);
    }
  },
  beforeDestroy() {
    if (!this.chart) return
    this.chart.dispose()
    this.chart = null
  }
}
</script>
<style scoped>
  .portal-eChart-box{
    margin-left: 10px;
    margin-right: 5px;
  }
</style>