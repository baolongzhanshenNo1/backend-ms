<template>
  <el-menu
    active-text-color="#ffd04b"
    background-color="#545c64"
    class="el-menu-vertical-demo"
    default-active="1"
    text-color="#fff"
    :collapse="isCollapsed"
    @open="handleOpen"
    @close="handleClose"
  >
    <div class="logo">
      <h4 v-show="!isCollapsed">后台管理系统</h4>
      <el-icon color="#000000" v-show="isCollapsed"><ColdDrink /></el-icon>
    </div>
    <!-- 使用v-for渲染一级列表 -->
    <template v-for="item in menuList" :key="item.index">
      <!-- 如果有children渲染为子菜单 -->
      <el-sub-menu v-if="item.children" :index="item.index">
        <template #title>
          <el-icon><component :is="getIconComponent(item.icon)" /></el-icon>
          <span>{{ item.title }}</span>
        </template>
        <!-- 渲染子菜单 -->
        <el-menu-item
          v-for="child in item.children"
          :key="child.index"
          :index="child.index"
          @click="handleMenuClick(child)"
        >
          {{ child.title }}
        </el-menu-item>
      </el-sub-menu>
      <!-- 如果没有children -->
      <el-menu-item v-else :index="item.index" @click="handleMenuClick(item)">
        <el-icon><component :is="getIconComponent(item.icon)" /></el-icon>
        <span>{{ item.title }}</span>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script setup>
import { computed, markRaw, ref } from 'vue';
import { House, Goods, User, Document } from '@element-plus/icons-vue';
import { useAllStoreData } from '@/stores';
import { useRoute, useRouter } from 'vue-router';
//定义一个映射对象,将字符串图标名映射到实际的图标组件
const iconMap = {
  house: markRaw(House),
  goods: markRaw(Goods),
  user: markRaw(User),
  document: markRaw(Document),
};
const store = useAllStoreData();

//定义一个辅助函数，根据图标名获取对应的图标组件
const getIconComponent = iconName => {
  return iconMap[iconName] || Document; //如果没有找到对应的图标，则默认使用Document图标
};

// 从store获取动态菜单数据，如果没有则使用默认菜单
const menuList = computed(() => {
  const storeMenuList = store.menuList;

  if (storeMenuList && storeMenuList.length > 0) {
    // 转换API返回的菜单格式为组件需要的格式
    return storeMenuList.map((item, index) => {
      const menuItem = {
        index: String(index + 1),
        title: item.lable || item.name,
        icon: item.icon,
        path: item.path,
      };

      // 处理子菜单
      if (item.children && item.children.length > 0) {
        menuItem.children = item.children.map((child, childIndex) => ({
          index: `${index + 1}-${childIndex + 1}`,
          title: child.lable || child.name,
          path: child.path,
          icon: child.icon,
        }));
      }

      return menuItem;
    });
  }

  // 默认菜单（未登录或没有菜单数据时显示）
  return [
    {
      index: '1',
      title: '首页',
      icon: 'house',
      path: '/home',
    },
  ];
});
const isCollapsed = computed(() => store.isCollapsed);
const route = useRoute();
const router = useRouter();
const handleMenuClick = item => {
  // 只有当item有有效路径时才添加tag和跳转
  if (item.path && item.path !== '') {
    // 添加tag到store
    const tag = {
      path: item.path,
      name: item.path.replace('/', '') || 'home',
      icon: item.icon,
      lable: item.title,
    };
    store.addTag(tag);

    // 跳转路由
    router.push(item.path);
  }
};
</script>
<style scoped>
.logo {
  line-height: 60px;
  text-align: center;
}
h4 {
  color: #fff;
  text-align: center;
  margin: 10px 10px;
  height: 60px;
  line-height: 60px;
  font-size: 20px;
  font-weight: bold;
}
.el-menu--vertical {
  border-right: none !important;
}
</style>
