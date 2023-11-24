<template>
  <div>
    <h1>
      Sony page
    </h1>
    <v-chart :option="chartOption" autoresize></v-chart>
  </div>
</template>
<script lang="ts" setup>
import { ref, onMounted } from 'vue';
import * as echarts from 'echarts/core';
import { GridComponent, GridComponentOption } from 'echarts/components';
import { BarChart, BarSeriesOption } from 'echarts/charts';
import { UniversalTransition } from 'echarts/features';
import { CanvasRenderer } from 'echarts/renderers';
import VChart from 'vue-echarts';

echarts.use([
  GridComponent,
  BarChart,
  CanvasRenderer,
  UniversalTransition
]);

type EChartsOption = echarts.ComposeOption<GridComponentOption | BarSeriesOption>;

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
      data: [260, 147, 135, 218, 224, 230, 150],
      type: 'bar'
    }
  ]
});

onMounted(()=>{
  console.log('Sony Customer Page');
})

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