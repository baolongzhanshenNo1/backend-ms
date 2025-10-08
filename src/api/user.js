import Mock from 'mockjs';

/**
 *
 * @param {*} url // 传入的url
 * @returns // 将url参数转换为对象
 */
function param2obj(url) {
  const search = url.split('?')[1];
  if (!search) return {};
  const params = new URLSearchParams(search);
  const obj = {};
  for (let [key, value] of params.entries()) {
    // 自动转换 page/limit 为数字
    if (key === 'page' || key === 'limit') {
      obj[key] = Number(value);
    } else {
      obj[key] = value;
    }
  }
  return obj;
}

// 使用 Mock.js 生成模拟数据列表
let List = Mock.mock({
  'list|100': [
    {
      id: '@guid', // ← 使用字符串模板，Mock.js 会自动调用 Random.guid()
      name: '@cname', // ← 同理
      addr: '@county(true)', // ← Mock.js 内置规则
      'age|18-60': 1, // ← Mock.js 支持这种语法
      birth: '@date', // ← 使用 @date 模板
      sex: '@integer(0,1)', // ← 或者使用 @integer
    },
  ],
}).list; // 注意：这里需要提取出 list 数组

// 导出默认对象，包含 getUserList 方法
export default {
  /**
   * 获取列表
   * 要带参数 name, page, limit; name可以不填, page,limit有默认值。
   * @param name, page, limit
   * @return {{code: number, count: number, data: *[]}}
   */
  getUserList: config => {
    // limit默认是10，因为分页器默认也是一页10个
    const { name, page = 1, limit = 10 } = param2obj(config.url);

    // 根据 name 筛选数据
    const mockList = List.filter(user => {
      // 如果 name 存在，根据 name 筛选数据
      if (name && user.name.indexOf(name) === -1) return false;
      return true;
    });

    // 分页：计算当前页的数据
    const pageList = mockList.filter((item, index) => {
      return index < limit * page && index >= limit * (page - 1);
    });

    // 返回符合接口规范的数据
    return {
      code: 200,
      data: {
        list: pageList,
        count: mockList.length, // 数据总条数需要返回
      },
    };
  },
  /**
   * 删除用户
   * @url /user/deleteUser
   * @method get
   * @param id
   * @return {{code: number, mes: string}}
   */
  deleteUser: config => {
    const { id } = param2obj(config.url);
    if (!id) {
      return {
        code: 400,
        data: null,
        msg: '参数不正确',
      };
    } else {
      List = List.filter(u => u.id !== id); // 过滤掉id为传入id的数据
      return {
        code: 200,
        data: null,
        msg: '删除成功',
      };
    }
  },
  addUser: config => {
    let formData = {};
    try {
      formData = JSON.parse(config.body || '{}'); // 👈 安全解析，默认空对象
    } catch (e) {
      return {
        code: 400,
        data: null,
        msg: '请求体格式错误',
      };
    }

    const { name, age, sex, addr, birth } = formData;

    if (!name || !age || !sex) {
      return {
        code: 400,
        data: null,
        msg: '缺少必要字段',
      };
    }

    List.unshift({
      id: Mock.Random.guid(),
      name: name,
      age: parseInt(age),
      sex: sex === '男' ? 1 : 0, // 统一存储为 1/0
      addr: addr || '',
      birth: birth || '',
    });

    return {
      code: 200,
      data: {
        msg: '添加成功',
      },
    };
  },
  editUser: config => {
    let formData = {};
    try {
      formData = JSON.parse(config.body || '{}');
    } catch (e) {
      return {
        code: 400,
        data: null,
        msg: '请求体格式错误',
      };
    }

    const { id, name, age, sex, addr, birth } = formData;

    if (!id) {
      return {
        code: 400,
        data: null,
        msg: '缺少 ID',
      };
    }

    const index = List.findIndex(u => u.id === id);
    if (index === -1) {
      return {
        code: 404,
        data: null,
        msg: '用户不存在',
      };
    }

    List[index] = {
      ...List[index],
      name: name,
      age: parseInt(age),
      sex: sex === '男' ? 1 : 0,
      addr: addr || List[index].addr,
      birth: birth || List[index].birth,
    };

    return {
      code: 200,
      data: {
        msg: '更新成功',
      },
    };
  },
};
