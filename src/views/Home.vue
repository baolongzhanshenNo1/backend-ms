<script setup>
import {
  ref,
  getCurrentInstance,
  onMounted,
  reactive,
  nextTick,
  computed,
} from 'vue';
import * as echarts from 'echarts';
import { ElRow, ElCol, ElTag } from 'element-plus';
import { useAllStoreData } from '@/stores';

const { proxy } = getCurrentInstance();
const store = useAllStoreData();

const tableData = ref([]);
const countData = ref([]);
const tableLabel = ref({
  name: '课程',
  todayBuy: '今日销量',
  monthBuy: '本月销量',
  totalBuy: '总销量',
});

// ✅ 定义三个独立配置项
const lineOptions = reactive({
  title: {
    text: '近七日各品牌销量趋势',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: [],
    top: 'bottom',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [],
});

const barOptions = reactive({
  title: {
    text: '用户活跃与新增趋势',
    left: 'center',
  },
  tooltip: {
    trigger: 'axis',
  },
  legend: {
    data: ['新增用户', '活跃用户'],
    top: 'bottom',
  },
  xAxis: {
    type: 'category',
    data: [],
  },
  yAxis: {
    type: 'value',
  },
  series: [],
});

const pieOptions = reactive({
  title: {
    text: '视频播放量分布',
    left: 'center',
  },
  tooltip: {
    trigger: 'item',
  },
  series: [
    {
      type: 'pie',
      label: {
        show: true,
        formatter: '{b}: {c} ({d}%)',
      },
      emphasis: {
        itemStyle: {
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowColor: 'rgba(0, 0, 0, 0.5)',
        },
      },
    },
  ],
});

const getImageUrl = name => {
  return new URL(`../assets/image/${name}.png`, import.meta.url).href;
};

// 用户信息相关的计算属性
const userInfo = computed(() => store.userInfo);

// 根据用户名获取显示名称和角色
const userDisplayInfo = computed(() => {
  if (!userInfo.value) {
    return {
      displayName: '游客',
      role: '未登录用户',
      lastLoginTime: '--',
      lastLoginLocation: '--',
    };
  }

  const username = userInfo.value.username;
  let displayName = '用户';
  let role = '普通用户';

  // 根据用户名判断角色和显示名称
  if (username === 'admin' || username === 'admin@example.com') {
    displayName = 'Admin';
    role = '超级管理员';
  } else if (username === 'user' || username === 'user@example.com') {
    displayName = 'User';
    role = '普通用户';
  } else {
    // 如果是邮箱，提取用户名部分
    displayName = username.includes('@') ? username.split('@')[0] : username;
    role = '普通用户';
  }

  return {
    displayName,
    role,
    lastLoginTime: userInfo.value.loginTime || getCurrentTime(),
    lastLoginLocation: userInfo.value.loginLocation || '中国',
  };
});

// 获取当前时间格式化字符串
const getCurrentTime = () => {
  const now = new Date();
  return now.toLocaleString('zh-CN', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
};

const getTableData = async () => {
  const data = await proxy.$api.getTableData();
  tableData.value = data.tableData;
  console.log('表格数据:', data);
};

const getCountData = async () => {
  const data = await proxy.$api.getCountData();
  countData.value = data.countData;
  console.log('计数数据:', data);
};

const getChartData = async () => {
  const { orderData, userData, videoData } = await proxy.$api.getChartData();

  // ==================== 折线图：品牌销量趋势 ====================
  lineOptions.xAxis.data = orderData.date;
  lineOptions.legend.data = Object.keys(orderData.data[0]);
  lineOptions.series = Object.keys(orderData.data[0]).map(val => ({
    name: val,
    type: 'line',
    data: orderData.data.map(item => item[val]),
    smooth: true,
  }));

  // ==================== 柱状图：用户活跃/新增 ====================
  barOptions.xAxis.data = userData.map(item => item.date);
  barOptions.series = [
    {
      name: '新增用户',
      type: 'bar',
      data: userData.map(item => item.new),
      itemStyle: { color: '#5470c6' },
    },
    {
      name: '活跃用户',
      type: 'bar',
      data: userData.map(item => item.active),
      itemStyle: { color: '#91cc75' },
    },
  ];

  // ==================== 饼图：视频播放分布 ====================
  pieOptions.series[0].data = videoData;

  // 等待 DOM 渲染完成
  await nextTick();

  // 初始化或更新三个图表
  initOrUpdateChart('orderEchart', lineOptions);
  initOrUpdateChart('userEchart', barOptions);
  initOrUpdateChart('pieEchart', pieOptions);

  console.log('图表数据加载完成:', { orderData, userData, videoData });
};

//  通用图表初始化/更新函数
const initOrUpdateChart = (refName, options) => {
  const dom = proxy.$refs[refName];
  if (!dom) {
    console.error(`图表容器 ${refName} 未找到！`);
    return;
  }

  let chartInstance = echarts.getInstanceByDom(dom);
  if (!chartInstance) {
    chartInstance = echarts.init(dom);
  }

  chartInstance.setOption(options);

  // 监听窗口变化
  window.addEventListener('resize', () => {
    chartInstance.resize();
  });
  // 监听容器变化
  // const observer = new ResizeObserver(e => {
  //   chartInstance.resize();
  // });
  // if (proxy.$refs['countDataContainer']) {
  //   observer.value.observe(proxy.$refs['countDataContainer']);
  // }
};

onMounted(() => {
  getTableData();
  getCountData();
  getChartData();
});
</script>
<template>
  <div class="home">
    <el-row :gutter="20">
      <el-col :span="7">
        <el-card shadow="hover">
          <el-row class="header">
            <el-col :span="12">
              <el-avatar :src="getImageUrl('user')" class="avatar" />
            </el-col>
            <el-col :span="12" class="text-container">
              <span style="font-size: 32px; margin-bottom: 10px">{{
                userDisplayInfo.displayName
              }}</span>
              <span style="font-size: 12px">{{ userDisplayInfo.role }}</span>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <div class="login-info">
                <span style="margin-bottom: 10px; margin-left: 15px"
                  >上次登录时间：</span
                >
                <span style="margin-left: 15px">上次登录地点:</span>
              </div>
            </el-col>
            <el-col :span="12">
              <div class="address-info">
                <span style="margin-bottom: 10px">{{
                  userDisplayInfo.lastLoginTime
                }}</span>
                <span>{{ userDisplayInfo.lastLoginLocation }}</span>
              </div>
            </el-col>
          </el-row>
        </el-card>
        <el-table :data="tableData" class="tableData">
          <el-table-column
            v-for="(val, key) in tableLabel"
            :key="key"
            :prop="key"
            :label="val"
          ></el-table-column>
        </el-table>
      </el-col>
      <el-col :span="17">
        <div class="countDataContainer">
          <el-card
            v-for="item in countData"
            :key="item.name"
            class="countData"
            shadow="hover"
          >
            <div class="content">
              <component
                :is="item.icon"
                class="icons"
                :style="{ background: item.color }"
              ></component>
              <div class="detail">
                <p class="num">￥{{ item.value }}</p>
                <p class="txt">{{ item.name }}</p>
              </div>
            </div>
          </el-card>
        </div>
        <div class="echartData">
          <div ref="orderEchart" style="width: 100%; height: 100%"></div>
        </div>
        <div class="user_pie_echart">
          <div class="echartData">
            <div ref="userEchart" style="width: 100%; height: 100%"></div>
          </div>
          <div class="echartData">
            <div ref="pieEchart" style="width: 100%; height: 100%"></div>
          </div>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<style scoped>
.el-row {
  margin-left: 0 !important;
  margin-right: 0 !important;
}
.header {
  border-bottom: 1px solid #ccc;
}
.el-col {
  padding: 10px 10px 10px 0 !important;
}
.avatar {
  width: 100px;
  height: 100px;
}
.text-container {
  display: flex;
  flex-direction: column; /* 让子元素纵向排列 */
  justify-content: center; /* 垂直居中 */
}

.login-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
}
.address-info {
  display: flex;
  flex-direction: column;
  justify-content: center;
  font-size: 12px;
}
.tableData {
  margin-top: 10px;
}
.countDataContainer {
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
}
.countData {
  display: flex;
  width: 32% !important;
  flex-wrap: wrap;
  margin: 0 0 10px 0;
}
.content {
  display: flex;
  justify-content: center;
  align-items: center;
}

.detail {
  margin-left: 15px;
}
.num {
  font-size: 24px;
}
.txt {
  font-size: 12px;
  line-height: 20px;
}
.icons {
  width: 50px;
  height: 100%;
  color: #fff;
}
.echartData {
  width: 100%;
  height: 260px;
  background-color: #ffffff;
  display: flex;
  justify-content: center;
}
.echartData:hover {
  box-shadow: 0 2px 12px 0 rgba(0, 0, 0, 0.1);
}
.user_pie_echart {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}
.echartContent {
  padding: 0 !important;
}
</style>
