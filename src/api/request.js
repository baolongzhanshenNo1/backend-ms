import axios from 'axios';
import { ElMessage } from 'element-plus';
import config from '@/config';

const NETWORK_ERROR = '网络请求失败';

const service = axios.create({
  baseURL: config.baseURL,
});
// 添加请求拦截器
service.interceptors.request.use(
  function (config) {
    // 在发送请求之前做些什么
    return config;
  },
  function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  }
);

// 添加响应拦截器
service.interceptors.response.use(
  res => {
    // 检查响应数据格式，如果不是JSON对象则可能是HTML等其他格式
    if (typeof res.data !== 'object' || res.data === null) {
      console.error('响应数据格式错误:', res.data);
      ElMessage.error('服务器响应格式错误');
      return Promise.reject('服务器响应格式错误');
    }

    const { code, data, msg } = res.data;
    if (code === 200) {
      return data;
    } else {
      ElMessage.error(msg || NETWORK_ERROR);
      return Promise.reject(new Error(msg || NETWORK_ERROR));
    }
  },
  error => {
    // 处理网络错误
    console.error('网络请求错误:', error);

    let errorMessage = NETWORK_ERROR;

    if (error.response) {
      // 服务器响应了错误状态码
      const status = error.response.status;
      switch (status) {
        case 400:
          errorMessage = '请求参数错误';
          break;
        case 401:
          errorMessage = '未授权，请重新登录';
          break;
        case 403:
          errorMessage = '拒绝访问';
          break;
        case 404:
          errorMessage = '请求地址不存在';
          break;
        case 500:
          errorMessage = '服务器内部错误';
          break;
        default:
          errorMessage = `请求失败 (${status})`;
      }
    } else if (error.request) {
      // 请求已发出但没有收到响应
      errorMessage = '网络连接失败，请检查网络';
    } else {
      // 其他错误
      errorMessage = error.message || NETWORK_ERROR;
    }

    ElMessage.error(errorMessage);
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * 封装请求函数
 * @param {Object} options - 请求配置对象
 * @returns {Promise} 返回一个Promise对象，用于处理请求结果
 */
function request(options) {
  // 设置请求方法，如果未指定则默认为'get'
  options.method = options.method || 'get';
  console.log(config);
  if (options.method.toLowerCase() === 'get') {
    options.params = options.data || {}; // 如果是get请求，将data参数转换为params参数
  }
  let isMock = config.mock; // 默认使用全局的mock配置
  // 如果请求配置中指定了mock，则使用请求配置中的mock值
  if (typeof options.mock !== 'undefined') {
    isMock = options.mock;
  }

  if (config.env === 'prod') {
    service.defaults.baseURL = config.baseApi; // 如果是生产环境，则使用配置中的baseURL
  } else {
    // 在开发环境中，如果使用本地mock，则使用本地baseApi让Mock.js拦截
    // 如果不使用mock，则使用真实的baseApi
    service.defaults.baseURL = config.baseApi; // 始终使用本地baseApi，让Mock.js拦截请求
  }
  // 调用service函数发送请求并返回结果
  return service(options);
}

export default request;
