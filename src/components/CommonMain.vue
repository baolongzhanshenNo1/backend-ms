<script setup>
import { computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAllStoreData } from '../stores';

const route = useRoute();
const router = useRouter();
const store = useAllStoreData();

// 使用store中的tags，过滤掉无效的tag
const tags = computed(() => {
  return store.tags.filter(tag => tag && tag.path && tag.lable);
});

//点击标签跳转
const handleTagClick = tag => {
  router.push(tag.path);
};

//删除标签
const handleTagClose = (tag, index) => {
  store.delTag(tag);
  // 如果删除的是当前激活的标签，跳转到首页
  if (route.path === tag.path) {
    router.push('/home');
  }
};
</script>

<template>
  <el-row :gutter="20">
    <el-tag
      v-for="(tag, index) in tags"
      :key="tag.name"
      :effect="route.path === tag.path ? 'dark' : 'plain'"
      @close="handleTagClose(tag, index)"
      :closable="tag.path !== '/home'"
      class="tag"
      @click="handleTagClick(tag)"
    >
      {{ tag.lable }}
    </el-tag>
  </el-row>
  <RouterView />
</template>

<style scoped>
.tag {
  margin-left: 10px;
  cursor: pointer;
}
</style>
