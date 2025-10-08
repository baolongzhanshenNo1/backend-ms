import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useAllStoreData = defineStore('allData', () => {
  // 响应式状态
  const isCollapsed = ref(false);
  const tags = ref([
    {
      path: '/home',
      name: 'home',
      icon: 'home',
      lable: '首页',
    },
  ]);

  // 用户菜单数据
  const menuList = ref([]);
  const userInfo = ref(null);
  //添加标签
  const addTag = tag => {
    // 验证tag数据的完整性
    if (!tag || !tag.path || !tag.lable) {
      console.warn('无效的tag数据:', tag);
      return;
    }

    // 检查是否已存在相同路径的tag
    if (!tags.value.some(t => t.path === tag.path)) {
      tags.value.push(tag);
    }
  };
  //删除标签
  const delTag = tag => {
    const index = tags.value.findIndex(t => t.path === tag.path);
    if (index !== -1) {
      tags.value.splice(index, 1);
    }
  };
  //获取当前标签
  const getCurrentTag = path => {
    return tags.value.find(t => t.path === path);
  };
  // Actions（修改状态的方法）
  const toggleCollapse = () => {
    isCollapsed.value = !isCollapsed.value;
  };
  const setCollapse = val => {
    isCollapsed.value = val;
  };

  // 设置用户菜单数据
  const setMenuList = menus => {
    menuList.value = menus;
  };

  // 设置用户信息
  const setUserInfo = user => {
    userInfo.value = user;
  };

  // 清理无效的tags
  const cleanInvalidTags = () => {
    tags.value = tags.value.filter(tag => tag && tag.path && tag.lable);
  };

  // 重置tags到初始状态
  const resetTags = () => {
    tags.value = [
      {
        path: '/home',
        name: 'home',
        icon: 'house',
        lable: '首页',
      },
    ];
  };

  // 清除用户数据（退出登录时使用）
  const clearUserData = () => {
    menuList.value = [];
    userInfo.value = null;
    resetTags();
  };

  // 返回要暴露的内容
  return {
    isCollapsed, // 响应式 ref
    toggleCollapse,
    setCollapse,
    tags,
    addTag,
    delTag,
    getCurrentTag,
    cleanInvalidTags,
    resetTags,
    menuList,
    userInfo,
    setMenuList,
    setUserInfo,
    clearUserData,
  };
});
