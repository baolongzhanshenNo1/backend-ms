<template>
  <div class="left-content">
    <el-button @click="handleCollapse"
      ><el-icon><DArrowLeft /></el-icon
    ></el-button>
    <el-breadcrumb :separator-icon="ArrowRight" class="el-breadcrumb">
      <el-breadcrumb-item
        v-for="(breadcrumb, index) in breadcrumbList"
        :key="index"
        :class="{
          'breadcrumb-current': breadcrumb.isCurrent,
          'breadcrumb-clickable':
            breadcrumb.isClickable !== false && breadcrumb.path !== route.path,
        }"
        @click="handleBreadcrumbClick(breadcrumb)"
      >
        {{ breadcrumb.title }}
      </el-breadcrumb-item>
    </el-breadcrumb>
  </div>
  <div class="right-content">
    <el-dropdown placement="bottom-end">
      <el-avatar :src="getImageUrl('user')" class="avatar" />
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item>个人中心</el-dropdown-item>
          <el-dropdown-item @click="goToAuth" v-if="!userInfo"
            >登录/注册</el-dropdown-item
          >
          <el-dropdown-item @click="logout" v-if="userInfo"
            >退出登录</el-dropdown-item
          >
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script setup>
import { ArrowRight } from '@element-plus/icons-vue';
import { useAllStoreData } from '../stores';
import { useRouter, useRoute } from 'vue-router';
import { computed } from 'vue';
import { ElMessage } from 'element-plus';

const router = useRouter();
const route = useRoute();

//动态引入图片
const getImageUrl = name => {
  return new URL(`../assets/image/${name}.png`, import.meta.url).href;
};
//引入store
const store = useAllStoreData();
const userInfo = computed(() => store.userInfo);

// 面包屑数据
const breadcrumbList = computed(() => {
  const path = route.path;
  const routeName = route.name;
  const routeTitle = route.meta?.title;

  // 基础面包屑（首页）
  const breadcrumbs = [
    {
      title: '首页',
      path: '/home',
      isHome: true,
      isClickable: path !== '/home', // 如果当前不是首页，首页可点击
    },
  ];

  // 如果当前不是首页，添加当前页面到面包屑
  if (path !== '/home' && path !== '/') {
    // 路由标题映射
    const routeTitleMap = {
      '/user': '用户管理',
      '/goods': '商品管理',
      '/other1': '其他1',
      '/other2': '其他2',
      '/other2-1': '其他2-1',
    };

    const currentTitle =
      routeTitle || routeTitleMap[path] || routeName || '未知页面';

    // 处理多级路由面包屑
    const pathSegments = path.split('/').filter(Boolean);

    // 特殊处理：other2-1 需要显示层级关系
    if (path === '/other2-1') {
      breadcrumbs.push({
        title: '其他',
        path: '', // 这是一个分类，没有具体路径
        isClickable: false,
        isCategory: true,
      });
      breadcrumbs.push({
        title: '其他2',
        path: '/other2',
        isClickable: true,
      });
    }
    // 处理其他路径
    else if (pathSegments.length > 1) {
      // 如果有多级路径，构建层级面包屑
      let currentPath = '';
      pathSegments.forEach((segment, index) => {
        currentPath += '/' + segment;
        if (index < pathSegments.length - 1) {
          // 不是最后一级，可以点击
          breadcrumbs.push({
            title: routeTitleMap[currentPath] || segment,
            path: currentPath,
            isClickable: true,
          });
        }
      });
    }

    // 添加当前页面（总是最后一个，不可点击）
    breadcrumbs.push({
      title: currentTitle,
      path: path,
      isClickable: false,
      isCurrent: true,
    });
  }

  return breadcrumbs;
});

const handleCollapse = () => {
  store.isCollapsed = !store.isCollapsed;
};

// 面包屑点击导航
const handleBreadcrumbClick = breadcrumb => {
  if (breadcrumb.isClickable !== false && breadcrumb.path !== route.path) {
    router.push(breadcrumb.path);
  }
};

// 跳转到登录页面
const goToAuth = () => {
  router.push('/login');
};

// 退出登录
const logout = () => {
  // 清除localStorage中的数据
  localStorage.removeItem('token');
  localStorage.removeItem('menuList');
  localStorage.removeItem('userInfo');

  // 清除store中的数据
  store.clearUserData();

  ElMessage.success('退出登录成功');
  router.push('/login');
};
</script>
<style scoped>
.left-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.right-content {
  display: flex;
  align-items: center;
}
.el-breadcrumb {
  margin-left: 20px;
}

/* 面包屑样式 */
:deep(.el-breadcrumb__inner) {
  cursor: pointer !important;
}

.breadcrumb-clickable {
  cursor: pointer;
}

.breadcrumb-clickable:hover :deep(.el-breadcrumb__inner) {
  color: #409eff;
}

.breadcrumb-current :deep(.el-breadcrumb__inner) {
  color: #606266;
  font-weight: 500;
  cursor: default;
}

.breadcrumb-current:hover :deep(.el-breadcrumb__inner) {
  color: #606266;
}
.avatar {
  cursor: pointer;
  user-select: none;
  transition: all 0.2s ease;
  border: 2px solid transparent;
}
.avatar:hover {
  transform: scale(1.05);
  border-color: #409eff; /* Element Plus 主色 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}
</style>
