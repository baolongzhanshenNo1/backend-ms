/**
 * 整个项目的api管理
 */
import request from './request';

// 在开发环境中创建共享的mock数据实例
let sharedUserApi = null;
if (import.meta.env.DEV) {
  import('./user.js').then(userModule => {
    sharedUserApi = userModule.default;
  });
}

// 请求首页左侧的表格数据
export default {
  /**
   *  获取表格数据的方法
   * @returns {Promise} 返回一个Promise对象，包含从API获取的表格数据
   */
  getTableData() {
    return request({
      //  发起HTTP请求获取表格数据
      url: '/home/getTableData', //  请求的API地址
      method: 'get', //  请求方法为GET
      mock: false, //  关闭mock数据
    });
  },
  getCountData() {
    return request({
      url: '/home/getCountData', //  请求的API地址
      method: 'get', //  请求方法为GET
      mock: false, //  关闭mock数据
    });
  },
  getChartData() {
    return request({
      url: '/home/getChartData', //  请求的API地址
      method: 'get', //  请求方法为GET
      mock: false, //  关闭mock数据
    });
  },
  getUserData(data) {
    // 在开发环境直接使用共享的mock数据逻辑
    if (import.meta.env.DEV) {
      return new Promise(resolve => {
        // 等待sharedUserApi初始化完成
        const checkAndExecute = () => {
          if (sharedUserApi) {
            // 构造mock请求参数
            const mockUrl = `/user/getUserData?${new URLSearchParams(data || {}).toString()}`;
            const result = sharedUserApi.getUserList({ url: mockUrl });

            // 模拟网络延迟
            setTimeout(() => {
              resolve(result.data);
            }, 300);
          } else {
            // 如果还没初始化完成，等待50ms后重试
            setTimeout(checkAndExecute, 50);
          }
        };
        checkAndExecute();
      });
    }

    return request({
      url: '/user/getUserData', //  请求的API地址
      method: 'get', //  请求方法为GET
      data,
      mock: true, //  启用mock数据
    });
  },
  deleteUser(data) {
    // 在开发环境直接使用共享的mock数据逻辑
    if (import.meta.env.DEV) {
      return new Promise(resolve => {
        // 等待sharedUserApi初始化完成
        const checkAndExecute = () => {
          if (sharedUserApi) {
            // 构造mock请求参数
            const mockUrl = `/user/deleteUser?${new URLSearchParams(data || {}).toString()}`;
            const result = sharedUserApi.deleteUser({ url: mockUrl });

            // 模拟网络延迟
            setTimeout(() => {
              resolve(result.data);
            }, 200);
          } else {
            // 如果还没初始化完成，等待50ms后重试
            setTimeout(checkAndExecute, 50);
          }
        };
        checkAndExecute();
      });
    }

    return request({
      url: '/user/deleteUser', //  请求的API地址
      method: 'get', //  请求方法为GET
      data,
      mock: true, //  启用mock数据
    });
  },
  addUser(data) {
    // 👈 接收 data 参数
    if (import.meta.env.DEV) {
      return new Promise(resolve => {
        if (!sharedUserApi) {
          setTimeout(() => resolve({ code: 500, msg: 'Mock 未初始化' }), 100);
          return;
        }
        // 模拟 POST 请求，body 是 JSON 字符串
        const mockConfig = {
          body: JSON.stringify(data), // 👈 将 data 转为 JSON 字符串
        };

        const result = sharedUserApi.addUser(mockConfig);

        setTimeout(() => {
          resolve(result.data);
        }, 300);
      });
    }
    return request({
      url: '/user/addUser',
      method: 'post',
      data, // 👈 传入 data
      mock: true,
    });
  },
  editUser(data) {
    if (import.meta.env.DEV) {
      return new Promise(resolve => {
        if (!sharedUserApi) {
          setTimeout(() => resolve({ code: 500, msg: 'Mock 未初始化' }), 100);
          return;
        }

        const mockConfig = {
          body: JSON.stringify(data),
        };

        const result = sharedUserApi.editUser(mockConfig);

        setTimeout(() => {
          resolve(result.data);
        }, 300);
      });
    }

    return request({
      url: '/user/editUser',
      method: 'post',
      data,
      mock: true,
    });
  },
  getMenu(params) {
    return request({
      url: '/permission/getMenu', //  请求的API地址
      method: 'post', //  请求方法为POST
      data: params,
    });
  },

  // 用户注册
  register(params) {
    return request({
      url: '/auth/register', //  请求的API地址
      method: 'post', //  请求方法为POST
      data: params,
    });
  },
};
