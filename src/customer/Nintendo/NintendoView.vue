<template>
  <div>
    <h1>
      Nintendo page
    </h1>
    <v-chart :option="chartOption" autoresize></v-chart>
  </div>
</template>
<script lang="ts" setup>
import { ref,onMounted } from 'vue';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { LineChart, LineSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

echarts.use([
  GridComponent,
  LineChart,
  CanvasRenderer,
  UniversalTransition
]);

type EChartsOption = echarts.ComposeOption<GridComponentOption | LineSeriesOption>;

const chartOption = ref<EChartsOption>({
  xAxis: {
    type: 'category',
    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      data: [150, 230, 224, 218, 135, 147, 260],
      type: 'line'
    }
  ]
});

onMounted(()=>{
  console.log('Nintendo Customer Page');
})

// onMounted(()=>{
//   import(/* webpackChunkName: "echarts" */ 'echarts').then(echarts => {
//     // 使用 echarts
//     const chartContainer = document.getElementById('chart-container');
//     const myChart = echarts.init(chartContainer);
//     // 在这里初始化和配置 echarts 图表
//     console.log(myChart);
//   });
// });

</script>
<style lang="scss" scoped>
h1{
  text-align: center;
}

.echarts{
  height: 600px;
  max-width: 1200px;
  margin: 0 auto;
}
</style>