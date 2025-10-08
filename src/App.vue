<script setup>
import { onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useAllStoreData } from './stores';

const route = useRoute();
const tagsStore = useAllStoreData();

// 监听路由变化，自动添加标签
watch(
  () => route.path,
  newPath => {
    // 跳过首页（已存在）
    if (newPath === '/home') return;

    // 从路由 meta 获取标签信息
    const tag = {
      path: newPath,
      name: route.name || newPath,
      label: route.meta.title || route.name || '新页面',
      icon: 'document',
    };

    tagsStore.addTag(tag);
  },
  { immediate: true } // 立即执行一次
);
</script>

<template>
  <RouterView />
</template>

<style scoped></style>
