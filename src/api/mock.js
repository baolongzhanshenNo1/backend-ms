import { SuccessFilled } from '@element-plus/icons-vue';
import Mock from 'mockjs';
import userApi from './user';
import permissionApi from './permission';
/**
 * mock
 * 第一个参数：表示你要拦截的请求地址
 * 第二个参数：表示你要拦截的请求方式
 * 第三个参数：表示你要拦截的请求返回的数据
 *
 */

Mock.mock('/api/home/getTableData', 'get', () => {
  return {
    code: 200,
    data: {
      tableData: [
        { name: 'oppo', todayBuy: 100, monthBuy: 872, totalBuy: 24525 },
        { name: 'vivo', todayBuy: 578, monthBuy: 7887, totalBuy: 54234 },
        { name: 'apple', todayBuy: 524, monthBuy: 5345, totalBuy: 54235 },
        { name: '小米', todayBuy: 356, monthBuy: 8676, totalBuy: 87358 },
        { name: '三星', todayBuy: 1600, monthBuy: 8676, totalBuy: 24525 },
        { name: '魅族', todayBuy: 698, monthBuy: 7867, totalBuy: 53278 },
        { name: '360', todayBuy: 100, monthBuy: 4252, totalBuy: 34532 },
      ],
    },
  };
});
Mock.mock('/api/home/getCountData', 'get', () => {
  return {
    code: 200,
    data: {
      countData: [
        {
          name: '今日支付订单',
          value: 245,
          icon: 'SuccessFilled',
          color: '#2ec7c9',
        },
        {
          name: '今日收藏订单',
          value: 524,
          icon: 'StarFilled',
          color: '#ffb980',
        },
        {
          name: '今日未支付订单',
          value: 535,
          icon: 'GoodsFilled',
          color: '#5ab1ef',
        },
        {
          name: '本月支付订单',
          value: 78,
          icon: 'SuccessFilled',
          color: '#2ec7c9',
        },
        {
          name: '本月收藏订单',
          value: 7867,
          icon: 'StarFilled',
          color: '#ffb980',
        },
        {
          name: '本月未支付订单',
          value: 525,
          icon: 'GoodsFilled',
          color: '#5ab1ef',
        },
      ],
    },
  };
});
Mock.mock('/api/home/getChartData', 'get', () => {
  return {
    code: 200,
    data: {
      orderData: {
        date: [
          '2020-11-01',
          '2020-11-02',
          '2020-11-03',
          '2020-11-04',
          '2020-11-05',
          '2020-11-06',
          '2020-11-07',
        ],
        data: [
          {
            苹果: 3839,
            vivo: 4323,
            小米: 3241,
            三星: 5435,
            魅族: 6435,
            360: 5435,
          },
          {
            苹果: 3432,
            vivo: 3544,
            小米: 5435,
            三星: 3543,
            魅族: 5435,
            360: 2343,
          },
          {
            苹果: 7863,
            vivo: 5343,
            小米: 4534,
            三星: 3343,
            魅族: 8687,
            360: 5435,
          },
          {
            苹果: 3543,
            vivo: 5435,
            小米: 4354,
            三星: 3543,
            魅族: 5343,
            360: 3453,
          },
          {
            苹果: 3543,
            vivo: 8978,
            小米: 4354,
            三星: 3543,
            魅族: 8676,
            360: 3433,
          },
          {
            苹果: 3543,
            vivo: 8978,
            小米: 5424,
            三星: 3543,
            魅族: 4534,
            360: 3433,
          },
          {
            苹果: 3543,
            vivo: 5343,
            小米: 4354,
            三星: 2342,
            魅族: 3543,
            360: 5343,
          },
        ],
      },
      videoData: [
        {
          name: '苹果',
          value: 8999,
        },
        {
          name: 'vivo',
          value: 6766,
        },
        {
          name: '小米',
          value: 7687,
        },
        {
          name: '三星',
          value: 6766,
        },
        {
          name: '魅族',
          value: 5435,
        },
        {
          name: '360',
          value: 2134,
        },
      ],
      userData: [
        { date: '周一', new: 5, active: 200 },
        { date: '周二', new: 10, active: 500 },
        { date: '周三', new: 12, active: 550 },
        { date: '周四', new: 60, active: 800 },
        { date: '周五', new: 65, active: 550 },
        { date: '周六', new: 53, active: 770 },
        { date: '周日', new: 33, active: 170 },
      ],
    },
  };
});
Mock.mock('/api/user/getUserData', 'get', userApi.getUserList);
Mock.mock('/api/user/deleteUser', 'get', userApi.deleteUser);
Mock.mock('/api/user/addUser', 'post', userApi.addUser);
Mock.mock('/api/user/editUser', 'post', userApi.editUser);
Mock.mock('/api/permission/getMenu', 'post', permissionApi.getMenu);
Mock.mock('/api/auth/register', 'post', permissionApi.register);
