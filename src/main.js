import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import 'element-plus/dist/index.css';
import App from './App.vue';
import router from './router';
import * as ElementPlusIconsVue from '@element-plus/icons-vue';
import './assets/css/reset.css';
import { createPinia } from 'pinia';
import './api/mock';
import api from '@/api/api';
import { useAllStoreData } from '@/stores';

const app = createApp(App);
const pinia = createPinia();

app.config.globalProperties.$api = api; // 全局挂载api
app.use(pinia);
app.use(ElementPlus);
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 恢复用户数据（页面刷新时）
const store = useAllStoreData();
const savedMenuList = localStorage.getItem('menuList');
const savedUserInfo = localStorage.getItem('userInfo');

if (savedMenuList) {
  try {
    const menuList = JSON.parse(savedMenuList);
    store.setMenuList(menuList);
  } catch (error) {
    console.error('恢复菜单数据失败:', error);
  }
}

if (savedUserInfo) {
  try {
    const userInfo = JSON.parse(savedUserInfo);
    store.setUserInfo(userInfo);
  } catch (error) {
    console.error('恢复用户信息失败:', error);
  }
}

app.use(router).mount('#app');
