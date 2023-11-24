<template>
  <div class="grid h-100 px-3">
    <div class="chartTemp">
      <span
      class="d-inline-block me-2"
      style="vertical-align: middle;"
      v-if="chartNameUpdating === false"
      >
        {{ chartName }}
      </span>
      <n-input
      type="text"
      placeholder="圖表名稱"
      class="me-2"
      style="vertical-align: middle; max-width: 300px"
      v-model:value="chartName"
      v-else
      />
      <n-button @click="chartNameUpdating = !chartNameUpdating">
        <template v-if="chartNameUpdating === false">
          更改標題
        </template>
        <template v-else>
          更改完成
        </template>
      </n-button>
      <v-chart
      v-if="chartShow"
      :option="chartObject"
      :style="{ width: '100%', height: '100%' }"
      ref="chartRef"
      autoresize
      />
    </div>
    <div class="chartSetting">
      <n-card>
        <n-tabs
        type="card"
        v-model:value="tagName"
        animated
        :addable="tags.length < 4"
        :closable="tags.length > 1"
        @add="tagsAdd"
        @close="tagsClose"
        >
          <n-tab-pane
          v-for="(tag, index) in tags"
          :key="`${tag.tagName}-${index}`"
          :name="tag.tagName"
          >
            <n-collapse>
              <!-- 呈現方式 -->
              <n-collapse-item title="呈現方式" name="1">
                <n-radio-group v-model:value="tag.chartType" name="chartType">
                  <n-space>
                    <n-radio
                    v-for="option in chartTypeOption"
                    :key="option.value"
                    :value="option.value"
                    >
                      {{ option.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </n-collapse-item>
              <!-- 圖表軸 -->
              <n-collapse-item title="圖表軸(共用)" name="2">
                <n-radio-group v-model:value="chartAxis" name="chartType">
                  <n-space>
                    <n-radio
                    v-for="option in chartAxisOption"
                    :key="option.value"
                    :value="option.value"
                    :disabled="chartAxisOptionDisabled(option.value)"
                    >
                      {{ option.label }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
              </n-collapse-item>
              <!-- 樣式設定 -->
              <n-collapse-item title="樣式設定" name="3">
                <n-collapse>
                  <n-collapse-item title="顏色" name="1">
                    <div class="d-flex text-center" style="gap: 12px;">
                      <span>啟用</span>
                      <span class="flex-fill">顏色</span>
                      <span class="px-1">插入</span>
                      <span class="px-1">移除</span>
                    </div>
                    <div
                    class="d-flex align-items-center mb-2"
                    style="gap: 12px;"
                    v-for="(item, index) in tag.chartColor"
                    :key="item"
                    >
                      <n-checkbox
                      class="px-2"
                      v-model:checked="item.use"
                      />
                      <n-color-picker
                      v-model:value="item.color"
                      />
                      <n-button @click="chartColorAdd(tag.chartColor, index)"> + </n-button>
                      <n-button @click="chartColorDel(tag.chartColor, index)"> - </n-button>
                    </div>
                  </n-collapse-item>
                  <n-collapse-item title="連結線" name="2" v-if="tag.chartType === 'line'">
                    <div class="mb-1">
                      <span>線寬</span>
                      <n-input-number v-model:value="tag.lineStyle.width" :min="1" />
                    </div>
                    <div class="mb-1">
                      <span>線色</span>
                      <n-color-picker v-model:value="tag.lineStyle.color"/>
                    </div>
                    <div class="mb-1">
                      <span>彎曲</span>
                      <n-slider v-model:value="tag.smooth" :marks="{0: 0, 1: 1}" :min="0" :max="1" :step="0.01"/>
                    </div>
                    <div class="mb-1">
                      <span>圓圈大小</span>
                      <n-input-number v-model:value="tag.symbolSize" />
                    </div>
                  </n-collapse-item>
                  <n-collapse-item title="柱狀" name="2" v-if="tag.chartType === 'bar'">
                    <div class="mb-1">
                      <span>極限寬度</span>
                      <n-input-number v-model:value="tag.barMaxWidth" />
                    </div>
                  </n-collapse-item>
                </n-collapse>
              </n-collapse-item>
              <!-- 圖表資料 -->
              <n-collapse-item title="圖表資料" name="4">
                <n-radio-group v-model:value="tag.chartDataType" name="chartDataType" class="mb-2">
                  <n-space>
                    <n-radio
                    v-for="item in chartDataTypeOption"
                    :key="item.value"
                    :value="item.value"
                    :checked="item.chartDataType === item.value"
                    name="chartDataType"
                    >
                      {{ item.name }}
                    </n-radio>
                  </n-space>
                </n-radio-group>
                <!-- 輸入式 -->
                <n-dynamic-input
                v-model:value="tag.chartData"
                v-if="tag.chartDataType === 'keyIn'"
                preset="pair"
                key-placeholder="資料名稱"
                value-placeholder="資料數值"
                />
                <!-- 匯入式 -->
                <div
                class="d-flex flex-wrap w-100"
                style="gap: 4px;"
                v-if="tag.chartDataType === 'import'">
                  <div
                  class="pointer text-center p-2"
                  style="flex: 0 1 calc(25% - 12px); border-radius: 4px; border: 1px solid #ccc;"
                  :class="{'selected': tag.chartDataImportFrom === key}"
                  v-for="(item, key) in chartDataImport"
                  :key="key"
                  @click="tag.chartDataImportFrom = key"
                  >
                  {{ key }}
                  </div>
                </div>
              </n-collapse-item>
            </n-collapse>
          </n-tab-pane>
        </n-tabs>
      </n-card>
    </div>
  </div>
</template>
<script setup>
import { ref, provide, computed, watch } from 'vue';
import { use } from 'echarts/core';
import {
  TitleComponent,
  TooltipComponent,
  ToolboxComponent,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
} from 'echarts/components';
import { BarChart, PieChart, LineChart} from 'echarts/charts';
import { CanvasRenderer } from 'echarts/renderers';
import VChart , { THEME_KEY } from 'vue-echarts';

import { NInput, NCard, NTabs, NTabPane, NCollapse, NCollapseItem, NRadioGroup, NSpace, NRadio, NButton, NCheckbox, NColorPicker, NInputNumber, NDynamicInput } from 'naive-ui';

use([
  TitleComponent,
  TooltipComponent,
  ToolboxComponent ,
  GridComponent,
  LegendComponent,
  DataZoomComponent,
  BarChart,
  PieChart,
  LineChart,
  CanvasRenderer,
]);

provide([THEME_KEY]);

const chartName = ref('圖表一');
const chartNameUpdating = ref(false);

// 頁籤
const tags = ref([
  {
    // 基本設定
    tagName: '數據1',
    chartType: 'line',
    chartData: [
      { value: '8', key: '客服部' },
      { value: '7', key: '創新部' },
      { value: '5', key: '技術部' },
      { value: '4', key: '銷售部' },
      { value: '3', key: '法務部' }
    ],
    chartColor: [
      {color: '#C95748FF', use: true},
      {color: '#96C95DFF', use: true}
    ],
    chartDataType: 'keyIn',
    chartDataImportFrom: '',

    // 樣式設定
    lineStyle: {
      width: 5,
      color: '#E56B20FF',
    },
    smooth: 0.5,
    symbolSize: 12,
    barMaxWidth: 30,
  },
  {
    // 基本設定
    tagName: '數據2',
    chartType: 'bar',
    chartData: [
      { value: '1', key: '客服部' },
      { value: '3', key: '創新部' },
      { value: '2', key: '技術部' },
      { value: '5', key: '銷售部' },
      { value: '4', key: '法務部' }
    ],
    chartColor: [
      {color: '#C94578FF', use: true},
      {color: '#C9596DFF', use: true}
    ],
    chartDataType: 'keyIn',
    chartDataImportFrom: '',

    // 樣式設定
    lineStyle: {
      width: 5,
      color: '#E256B0FF',
    },
    smooth: 0,
    symbolSize: 20,
    barMaxWidth: 30,
  },
]);
const tagName = ref('數據1');
const tagIndex = computed(() => tags.value.findIndex(item => item.tagName === tagName.value));
const tagsAdd = function(){
  function newTagNameCreate(wordLength = 4){
    let randomWord = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    let name = '';
    for(let i=1; i<wordLength; i++){
      name += randomWord[Math.floor(Math.random()*62)]
    }
    return name;
  }

  tags.value.push({
    tagName: `新的數據${newTagNameCreate()}`,
    chartType: 'bar',
    chartData: [
      { value: '0', key: '資料名稱' },
    ],
    chartColor: [
      {color: '#000000FF', use: true},
    ],
    chartDataType: 'keyIn',
    chartDataImportFrom: '',
    lineStyle: {
      width: 5,
      color: '#000000FF',
    },
    smooth: 0,
    symbolSize: 12,
    barMaxWidth: 30,
  },);
};
const tagsClose = function(targetTag){
  let targetData = tags.value.find(item => item.tagName === targetTag);
  if(targetTag === tagName.value){
    if(tags.value.indexOf(targetData) === 0){
      tagName.value = tags.value[1].tagName;
    } else {
      tagName.value = tags.value[0].tagName;
    }
  }
  chartRef.value.dispatchAction({
    type: 'legendUnSelect',
    name: targetTag
  });

  setTimeout(()=>{
    tags.value.splice(tags.value.indexOf(targetData), 1);
  }, 100);
};

const chartDataImport = ref(
  {
    出勤人數: [
      { value: 8, key: '客服部' },
      { value: 7, key: '創新部' },
      { value: 13, key: '技術部' },
      { value: 23, key: '銷售部' },
      { value: 4, key: '法務部' }
    ],
    主管人數: [
      { value: 2, key: '客服部' },
      { value: 2, key: '創新部' },
      { value: 3, key: '技術部' },
      { value: 4, key: '銷售部' },
      { value: 1, key: '法務部' }
    ],
    主管均管理數: [
      { value: 4, key: '客服部' },
      { value: 3.50, key: '創新部' },
      { value: 4.33, key: '技術部' },
      { value: 5.75, key: '銷售部' },
      { value: 4, key: '法務部' }
    ],
    已婚人數: [
      { value: 2, key: '客服部' },
      { value: 0, key: '創新部' },
      { value: 1, key: '技術部' },
      { value: 3, key: '銷售部' },
      { value: 1, key: '法務部' }
    ],
    平均歲數: [
      { value: 26, key: '客服部' },
      { value: 26, key: '創新部' },
      { value: 29, key: '技術部' },
      { value: 31, key: '銷售部' },
      { value: 32, key: '法務部' }
    ]
  }
);

// 圖表類型
watch(tags, ()=>{
  // chartShow.value = false;
  setTimeout(()=>{ chartShow.value = true },0);
  if(tags.value[tagIndex.value].chartType !== 'pie' && tags.value[tagIndex.value].chartXaxis === 'r'){
    tags.value[tagIndex.value].chartXaxis = 'x';
  }
  if(tags.value[tagIndex.value].chartType === 'pie'){
    tags.value[tagIndex.value].chartXaxis = 'r';
  }
}, {deep: true});
const chartTypeOption = ref([
  {
    label: "折線圖",
    value: "line"
  },
  {
    label: "長條圖",
    value: "bar"
  },
  {
    label: "圓餅圖",
    value: "pie"
  },
]);

// 顏色增刪
const chartColorAdd = function(chartColor, index){
  chartColor.splice(index + 1, 0, {color: '#000000FF', use: true})
};
const chartColorDel = function(chartColor, index){
  chartColor.splice(index, 1)
};

// 資料源選項
const chartDataTypeOption = ref([
  {
    name: '輸入式',
    value: 'keyIn'
  },
  {
    name: '匯入式',
    value: 'import'
  },
]);

// axis
const chartAxis = ref('x');
const chartAxisOption = ref([
  {
    label: "橫軸",
    value: "x"
  },
  {
    label: "縱軸",
    value: "y"
  },
]);
const chartAxisOptionDisabled = computed(()=>{
  return (option)=>{
    if(tags.value[tagIndex.value].chartType === 'pie'){
      return option !== 'r';
    }
    return option === 'r';
  }
});
const chartAxisData = computed(() => {
  return tags.value.map(item => {
    // 如果資料是匯入的，且有指定來源。
    // 是：從匯入列表取出 key
    if(item.chartDataType === 'import' && item.chartDataImportFrom !== ''){
      return chartDataImport.value[item.chartDataImportFrom].map(importData => importData.key);
    }
    // 否：從輸入取出 key
    return item.chartData.map(keyInData => keyInData.key);
  })
  .flat(3)
  .reduce((arr, item) => {
    if(arr.includes(item) === false){
      arr.push(item)
    }
    return arr
  }, []);
});
const chartAxisComputed = computed(()=>{
  let axis = {
    xAxis: {},
    yAxis: {},
  }
  if(chartAxis.value === 'x'){
    axis = {
      xAxis: {
        data: chartAxisData.value,
        type: 'category',
        show: true,
      },
      yAxis: {
        type: 'value',
        show: true,
      },
    };
  }
  if(chartAxis.value === 'y'){
    axis = {
      xAxis: {
        type: 'value',
        show: true,
      },
      yAxis: {
        data: chartAxisData.value,
        type: 'category',
        show: true,
      },
    };
  }
  if(tags.value.filter(item=>item.chartType === 'pie').length === tags.value.length){
    axis = {
      xAxis: {
        show: false,
      },
      yAxis: {
        show: false,
      },
    };
  }
  return axis;
});

// tooltip
const chartTooltipComputed = computed(()=>{
  if(tags.value[tagIndex.value].chartXaxis === 'r'){
    return {
      trigger: 'item',
    }
  }
  return {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  }
});

// chart
const chartRef = ref(null);
const chartShow = ref(true);
const chartPiePosition = ref({
  '1chart': {
    radius: '75%',
    centers: {
      0: [],
      1: [['50%', '50%']]
    }
  },
  '2chart':{
    radius: '30%',
    centers: {
      0: [],
      1: [['50%', '25%']],
      2: [['50%', '25%'], ['50%', '75%']],
    }
  },
  '3chart':{
    radius: '30%',
    centers: {
      0: [],
      1: [['50%', '25%']],
      2: [['25%', '25%'], ['75%', '25%']],
      3: [['25%', '25%'], ['75%', '25%'], ['50%', '75%']],
    }
  },
  '4chart':{
    radius: '30%',
    centers: {
      0: [],
      1: [['50%', '25%']],
      2: [['25%', '25%'], ['75%', '25%']],
      3: [['20%', '25%'], ['50%', '25%'], ['80%', '25%']],
      4: [['25%', '25%'], ['75%', '25%'], ['25%', '75%'], ['75%', '75%']],
    }
  },
});
const chartPieComputed = computed(()=>{
  let res = {
    radius: chartPiePosition.value[`${tags.value.length}chart`].radius,
    center: chartPiePosition.value[`${tags.value.length}chart`].centers[tags.value.filter(item => item.chartType === 'pie').length],
  }
  return res;
});

const chartObject = computed(()=>{
  let pieChartSerial = 0;   // 圓餅圖序號
  return {
    tooltip: chartTooltipComputed.value,
    xAxis: chartAxisComputed.value.xAxis,
    yAxis: chartAxisComputed.value.yAxis,
    legend: {
      data: tags.value.map(item => item.tagName),
      icon: 'circle'
    },
    grid: {
      containLabel: true,
      top: tags.value.filter(tag => tag.chartType === 'pie').length ? '50%' :60,
    },
    series: tags.value.map((tag) => {
      let data = tag.chartData; // 圖表預設採用輸入式資料
      let seriesResult = {};    // echart的series資料
      // data原本使用輸入式，如果有勾選匯入式且選擇特定資料，取代掉原本的data
      if(tag.chartDataType === 'import' && tag.chartDataImportFrom !== ''){
        data = chartDataImport.value[tag.chartDataImportFrom];
      }
      // echart的series資料
      seriesResult = {
        name: tag.tagName,
        type: tag.chartType,
        lineStyle: tag.lineStyle,
        smooth: tag.smooth,
        barMaxWidth: tag.barMaxWidth,
        radius: chartPieComputed.value.radius,
        center: chartPieComputed.value.center[pieChartSerial],
        itemStyle: {
          color: tag.chartColor[0].color,
        },
        data: chartAxisData.value.map((axisItem, axisIndex)=>{
          return {
            name: axisItem,
            value: data.find(item => item.key === axisItem) ? data.find(item => item.key === axisItem).value : null,
            symbolSize: tag.symbolSize,
            itemStyle: {
              color: tag.chartColor.filter(item => item.use)[axisIndex % tag.chartColor.filter(item => item.use).length].color,
            },
          }
        })
      }
      // 如果是圓餅圖，將圓餅圖序號+1。
      if(tag.chartType === 'pie'){
        pieChartSerial += 1;
      }
      return seriesResult;
    }),
  };
});

</script>
<style lang="scss" scoped>
// @import '../components-scss/color-setting.scss';

.grid{
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  gap: 16px;
  height: 600px;
  width: 90%;
  max-width: 1600px;
  margin: auto;
  .chartTemp{
    border: 1px solid #333;
    grid-column: 1/9;
    grid-row: 1/-1;
  }
  .chartSetting{
    grid-column: 9/-1;
    grid-row: 1/-1;
  }
}

.selected{
  color: #E56B20;
  border: 1px solid #E56B20 !important;
}

img{
  width: 24px;
  cursor: pointer;
  filter: opacity(0.3);
  transition-duration: .3s;
  &:hover{
    filter: opacity(1);
  }
}

.w-100{
  width: 100%;
}
.mb-1{
  margin-bottom: 4px;
}
.px-1{
  padding-left: 4px;
  padding-right: 4px;
}
.px-2{
  padding-left: 8px;
  padding-right: 8px;
}
.text-center{
  text-align: center;
}
.d-flex{
  display: flex;
}
.flex-wrap{
  flex-wrap: wrap;
}
.align-items-center{
  align-items: center;
}
.flex-fill{
  flex: auto;
}
</style>