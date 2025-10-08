<template>
  <div class="common-layout">
    <el-container class="el-container">
      <el-aside
        class="el-aside"
        :style="{ width: isCollapsed ? '64px' : '180px' }"
      >
        <CommonAside />
      </el-aside>
      <el-container>
        <el-header class="el-header">
          <CommonHeader />
        </el-header>
        <el-main class="el-main">
          <CommonMain />
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import { computed, ref } from 'vue';
import { useAllStoreData } from '../stores';
import CommonAside from '@/components/CommonAside.vue';
import CommonHeader from '@/components/CommonHeader.vue';
import CommonMain from '../components/CommonMain.vue';

const store = useAllStoreData();
const isCollapsed = computed(() => store.isCollapsed);
</script>

<style scoped>
.common-layout,
.el-container {
  height: 100vh;
}
.el-aside {
  background-color: #545c64;
  height: 100%;
  transition: width 0.3s ease;
}
.el-header {
  display: flex;
  background-color: #333;
  width: 100%;
  justify-content: space-between;
  align-items: center;
}
.el-main {
  background-color: #e9eef3;
  /* padding: 10px 10px; */
}
</style>
