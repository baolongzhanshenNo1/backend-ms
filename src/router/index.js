import { createRouter, createWebHashHistory } from 'vue-router';
import { useAllStoreData } from '@/stores';

//定制路由
const routes = [
  {
    path: '/',
    name: 'main',
    component: () => import('@/views/Main.vue'),
    redirect: '/home',
    children: [
      {
        path: 'home',
        name: 'home',
        meta: { title: '首页' },
        component: () => import('@/views/Home.vue'),
      },
      {
        path: 'user',
        name: 'user',
        meta: { title: '用户管理' },
        component: () => import('@/views/User.vue'),
      },
      {
        path: 'goods',
        name: 'goods',
        meta: { title: '商品管理' },
        component: () => import('@/views/User.vue'), // 暂时使用User组件作为占位符
      },
      {
        path: 'other1',
        name: 'other1',
        meta: { title: '其他1' },
        component: () => import('@/views/User.vue'), // 暂时使用User组件作为占位符
      },
      {
        path: 'other2',
        name: 'other2',
        meta: { title: '其他2' },
        component: () => import('@/views/User.vue'), // 暂时使用User组件作为占位符
      },
      {
        path: 'other2-1',
        name: 'other2-1',
        meta: { title: '其他2-1' },
        component: () => import('@/views/User.vue'), // 暂时使用User组件作为占位符
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Auth.vue'),
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('@/views/Auth.vue'),
  },
];

const router = createRouter({
  //设置路由模式
  history: createWebHashHistory(),
  routes,
});

// 路由守卫：自动添加tag
router.beforeEach((to, from, next) => {
  // 排除登录和注册页面，以及根路径
  if (to.path !== '/login' && to.path !== '/register' && to.path !== '/') {
    const store = useAllStoreData();

    // 确保有完整的路由信息
    const routeName = to.name || to.path.replace('/', '') || 'home';
    const routeTitle = to.meta?.title || routeName || '未知页面';

    // 只有当路由信息完整时才添加tag
    if (routeName && routeTitle) {
      const tag = {
        path: to.path,
        name: routeName,
        icon: getIconByPath(to.path),
        lable: routeTitle,
      };
      store.addTag(tag);
    }
  }
  next();
});

// 根据路径获取对应的图标
function getIconByPath(path) {
  const iconMap = {
    '/home': 'house',
    '/user': 'user',
    '/goods': 'goods',
    '/other1': 'document',
    '/other2': 'document',
    '/other2-1': 'document',
  };
  return iconMap[path] || 'document';
}

export default router;
